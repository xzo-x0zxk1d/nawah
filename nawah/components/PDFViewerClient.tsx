'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Pen, Highlighter, StickyNote, Save, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2, X } from 'lucide-react';

type Tool = 'none' | 'pen' | 'highlight' | 'note';
type Note = { id: string; x: number; y: number; text: string; page: number };

interface Stroke {
  tool: 'pen' | 'highlight';
  color: string;
  points: { x: number; y: number }[];
  page: number;
}

export default function PDFViewerClient({
  subject,
  grade,
  pdfPath,
}: {
  subject: string;
  grade: string;
  pdfPath: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef<{ x: number; y: number }[]>([]);

  const [activeTool, setActiveTool] = useState<Tool>('none');
  const [penColor, setPenColor] = useState('#00c9b1');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [addingNote, setAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [saved, setSaved] = useState(false);

  const storageKey = `nawah_viewer_${subject}_${grade}`;

  useEffect(() => {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.strokes) setStrokes(parsed.strokes);
      if (parsed.notes) setNotes(parsed.notes);
    }
  }, [storageKey]);

  useEffect(() => {
    renderPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, zoom, strokes, notes]);

  const renderPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw page background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placeholder text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`صفحة ${page} من ${totalPages}`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '13px serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('سيتم تحميل ملف PDF هنا عند توفره', canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText(pdfPath, canvas.width / 2, canvas.height / 2 + 35);

    // Draw strokes for current page
    strokes.filter((s) => s.page === page).forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.tool === 'highlight' ? 16 : 2;
      ctx.globalAlpha = stroke.tool === 'highlight' ? 0.35 : 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw notes for current page
    notes.filter((n) => n.page === page).forEach((note) => {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(note.x, note.y, 160, 80);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.strokeRect(note.x, note.y, 160, 80);
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px serif';
      ctx.textAlign = 'right';
      const words = note.text.split(' ');
      let line = '';
      let y = note.y + 18;
      words.forEach((w) => {
        if ((line + w).length > 18) { ctx.fillText(line, note.x + 148, y); line = w + ' '; y += 15; }
        else line += w + ' ';
      });
      ctx.fillText(line, note.x + 148, y);
    });
  }, [page, pdfPath, strokes, notes, totalPages]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'note') {
      const pos = getPos(e);
      const newNote: Note = { id: Date.now().toString(), x: pos.x, y: pos.y, text: '', page };
      setEditingNote(newNote);
      setAddingNote(false);
      return;
    }
    if (activeTool === 'pen' || activeTool === 'highlight') {
      isDrawing.current = true;
      currentStroke.current = [getPos(e)];
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const pos = getPos(e);
    currentStroke.current.push(pos);

    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = activeTool === 'highlight' ? '#fbbf24' : penColor;
    ctx.lineWidth = activeTool === 'highlight' ? 16 : 2;
    ctx.globalAlpha = activeTool === 'highlight' ? 0.35 : 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const pts = currentStroke.current;
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const onMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.length > 1) {
      setStrokes((prev) => [
        ...prev,
        {
          tool: activeTool as 'pen' | 'highlight',
          color: activeTool === 'highlight' ? '#fbbf24' : penColor,
          points: [...currentStroke.current],
          page,
        },
      ]);
    }
    currentStroke.current = [];
    const canvas = drawRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveData = () => {
    localStorage.setItem(storageKey, JSON.stringify({ strokes, notes }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearPage = () => {
    setStrokes((prev) => prev.filter((s) => s.page !== page));
    setNotes((prev) => prev.filter((n) => n.page !== page));
  };

  const saveNote = () => {
    if (!editingNote) return;
    if (editingNote.text.trim()) {
      setNotes((prev) => {
        const exists = prev.find((n) => n.id === editingNote.id);
        if (exists) return prev.map((n) => (n.id === editingNote.id ? editingNote : n));
        return [...prev, editingNote];
      });
    }
    setEditingNote(null);
  };

  const W = 680, H = 880;

  return (
    <div className="flex flex-col h-screen bg-nawah-900">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-nawah-800 border-b border-nawah-700 overflow-x-auto">
        <span className="text-white font-bold text-sm whitespace-nowrap" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
          أدوات التحرير:
        </span>

        {[
          { id: 'pen', icon: <Pen size={16} />, label: 'قلم' },
          { id: 'highlight', icon: <Highlighter size={16} />, label: 'تظليل' },
          { id: 'note', icon: <StickyNote size={16} />, label: 'ملاحظة' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(activeTool === t.id ? 'none' : (t.id as Tool))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
              activeTool === t.id
                ? 'bg-nawah-teal text-nawah-900 font-bold'
                : 'bg-nawah-700 text-slate-300 hover:bg-nawah-600'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}

        {activeTool === 'pen' && (
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
        )}

        <div className="flex-1" />

        <button onClick={() => setZoom((z) => Math.min(z + 0.25, 2))} className="p-2 text-slate-400 hover:text-nawah-teal">
          <ZoomIn size={18} />
        </button>
        <span className="text-slate-400 text-sm">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} className="p-2 text-slate-400 hover:text-nawah-teal">
          <ZoomOut size={18} />
        </button>

        <button onClick={clearPage} className="p-2 text-slate-400 hover:text-red-400">
          <Trash2 size={18} />
        </button>
        <button onClick={saveData} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${saved ? 'bg-green-500/20 text-green-400' : 'bg-nawah-teal/20 text-nawah-teal'} hover:opacity-80 transition-all`}>
          <Save size={16} />
          {saved ? 'تم الحفظ!' : 'حفظ'}
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-6 bg-slate-700/20">
        <div
          className="relative shadow-2xl"
          style={{ width: W * zoom, height: H * zoom }}
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="absolute inset-0"
            style={{ width: W * zoom, height: H * zoom }}
          />
          <canvas
            ref={drawRef}
            width={W}
            height={H}
            className="absolute inset-0"
            style={{
              width: W * zoom,
              height: H * zoom,
              cursor:
                activeTool === 'pen' ? 'crosshair'
                : activeTool === 'highlight' ? 'cell'
                : activeTool === 'note' ? 'copy'
                : 'default',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-nawah-800 border-t border-nawah-700">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="p-2 text-slate-400 hover:text-nawah-teal disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
        <span className="text-white text-sm">
          صفحة <strong>{page}</strong> من <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="p-2 text-slate-400 hover:text-nawah-teal disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Note editing modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-nawah-800 rounded-2xl p-6 w-full max-w-sm border border-nawah-teal/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>إضافة ملاحظة</h3>
              <button onClick={() => setEditingNote(null)} className="text-slate-400 hover:text-red-400">
                <X size={18} />
              </button>
            </div>
            <textarea
              autoFocus
              value={editingNote.text}
              onChange={(e) => setEditingNote({ ...editingNote, text: e.target.value })}
              className="w-full h-28 bg-nawah-700 border border-nawah-600 rounded-xl p-3 text-white text-sm resize-none"
              placeholder="اكتب ملاحظتك هنا..."
            />
            <div className="flex gap-3 mt-4">
              <button onClick={saveNote} className="btn-primary flex-1 py-2.5 rounded-xl text-sm">
                حفظ الملاحظة
              </button>
              <button onClick={() => setEditingNote(null)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
