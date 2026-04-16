'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Pen, Highlighter, StickyNote, Save, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2, X, Loader2 } from 'lucide-react';

type Tool = 'none' | 'pen' | 'highlight' | 'note';

interface Stroke { id?: string; tool: 'pen'|'highlight'; color: string; points: {x:number;y:number}[]; page: number; }
interface Note { id?: string; x: number; y: number; text: string; page: number; }

function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('nawah_current_user') || 'null'); } catch { return null; }
}

export default function PDFViewerClient({ subject, grade, pdfPath: _pdfPath }: { subject: string; grade: string; pdfPath: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef<{x:number;y:number}[]>([]);

  const [activeTool, setActiveTool] = useState<Tool>('none');
  const [penColor, setPenColor] = useState('#00c9b1');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note|null>(null);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string|null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas'|'iframe'>('iframe');

  const user = getCurrentUser();
  const userId = user?.id ?? 'guest';

  // ── Load PDF URL from Blob via API ────────────────────────────────────────
  useEffect(() => {
    setPdfLoading(true); setPdfError(false);
    fetch(`/api/blob-url?subject=${subject}&grade=${grade}`)
      .then(r => r.json())
      .then(({ url }) => {
        if (url) { setPdfUrl(url); } else { setPdfError(true); }
      })
      .catch(() => setPdfError(true))
      .finally(() => setPdfLoading(false));
  }, [subject, grade]);

  // ── Load annotations from Supabase ───────────────────────────────────────
  useEffect(() => {
    if (userId === 'guest') {
      // fallback to localStorage
      try {
        const raw = localStorage.getItem(`nawah_annot_${subject}_${grade}`);
        if (raw) { const d = JSON.parse(raw); setStrokes(d.strokes||[]); setNotes(d.notes||[]); }
      } catch {}
      return;
    }
    fetch(`/api/annotations?user_id=${userId}&subject=${subject}&grade=${grade}`)
      .then(r => r.json())
      .then((rows: {id:string;type:string;data:string;page:number}[]) => {
        if (!Array.isArray(rows)) return;
        const s: Stroke[] = [], n: Note[] = [];
        rows.forEach(row => {
          try {
            const d = JSON.parse(row.data);
            if (row.type === 'stroke') s.push({ ...d, id: row.id });
            else n.push({ ...d, id: row.id });
          } catch {}
        });
        setStrokes(s); setNotes(n);
      }).catch(() => {});
  }, [userId, subject, grade]);

  // ── Canvas render ─────────────────────────────────────────────────────────
  const renderPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (viewMode === 'canvas') {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.fillText(`الصفحة ${page} – ${subject} – ${grade}`, canvas.width/2, canvas.height/2);
    }

    strokes.filter(s => s.page === page).forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.tool === 'highlight' ? 16 : 2;
      ctx.globalAlpha = stroke.tool === 'highlight' ? 0.35 : 1;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke(); ctx.globalAlpha = 1;
    });

    notes.filter(n => n.page === page).forEach(note => {
      ctx.fillStyle = '#fef08a'; ctx.fillRect(note.x, note.y, 160, 80);
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1; ctx.strokeRect(note.x, note.y, 160, 80);
      ctx.fillStyle = '#1e293b'; ctx.font = '11px serif'; ctx.textAlign = 'right';
      const words = note.text.split(' '); let line = ''; let y = note.y + 18;
      words.forEach(w => {
        if ((line+w).length > 18) { ctx.fillText(line, note.x+148, y); line = w+' '; y += 15; }
        else line += w+' ';
      });
      ctx.fillText(line, note.x+148, y);
    });
  }, [page, strokes, notes, subject, grade, viewMode]);

  useEffect(() => { if (viewMode === 'canvas') renderPage(); }, [renderPage, viewMode]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = drawRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left)/zoom, y: (e.clientY - r.top)/zoom };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'note') { const pos = getPos(e); setEditingNote({ x: pos.x, y: pos.y, text: '', page }); return; }
    if (activeTool === 'pen' || activeTool === 'highlight') { isDrawing.current = true; currentStroke.current = [getPos(e)]; }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const pos = getPos(e); currentStroke.current.push(pos);
    const canvas = drawRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = activeTool === 'highlight' ? '#fbbf24' : penColor;
    ctx.lineWidth = activeTool === 'highlight' ? 16 : 2;
    ctx.globalAlpha = activeTool === 'highlight' ? 0.35 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pts = currentStroke.current;
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke(); ctx.globalAlpha = 1;
  };
  const onMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.length > 1) {
      setStrokes(prev => [...prev, { tool: activeTool as 'pen'|'highlight', color: activeTool==='highlight'?'#fbbf24':penColor, points: [...currentStroke.current], page }]);
    }
    currentStroke.current = [];
    const canvas = drawRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveData = async () => {
    setSaving(true);
    try {
      if (userId === 'guest') {
        localStorage.setItem(`nawah_annot_${subject}_${grade}`, JSON.stringify({ strokes, notes }));
      } else {
        // Delete old annotations for this subject/grade then re-insert
        await fetch(`/api/annotations?user_id=${userId}&subject=${subject}&grade=${grade}`, { method: 'DELETE' }).catch(()=>{});
        const saves = [
          ...strokes.map(s => ({ user_id: userId, subject, grade, page: s.page, type: 'stroke', data: JSON.stringify(s) })),
          ...notes.map(n => ({ user_id: userId, subject, grade, page: n.page, type: 'note', data: JSON.stringify(n) })),
        ];
        for (const ann of saves) {
          await fetch('/api/annotations', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(ann) });
        }
      }
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch { alert('حدث خطأ أثناء الحفظ'); }
    finally { setSaving(false); }
  };

  const clearPage = () => { setStrokes(prev => prev.filter(s => s.page !== page)); setNotes(prev => prev.filter(n => n.page !== page)); };

  const saveNote = () => {
    if (!editingNote) return;
    if (editingNote.text.trim()) {
      setNotes(prev => {
        const exists = editingNote.id && prev.find(n => n.id === editingNote.id);
        if (exists) return prev.map(n => n.id === editingNote.id ? editingNote : n);
        return [...prev, editingNote];
      });
    }
    setEditingNote(null);
  };

  const W = 680, H = 880;

  return (
    <div className="flex flex-col h-screen bg-nawah-900">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-nawah-800 border-b border-nawah-700 overflow-x-auto flex-shrink-0">
        <span className="text-white font-bold text-sm whitespace-nowrap" style={{fontFamily:'Noto Kufi Arabic, serif'}}>أدوات:</span>
        {[{id:'pen',icon:<Pen size={15}/>,label:'قلم'},{id:'highlight',icon:<Highlighter size={15}/>,label:'تظليل'},{id:'note',icon:<StickyNote size={15}/>,label:'ملاحظة'}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTool(activeTool===t.id?'none':t.id as Tool)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${activeTool===t.id?'bg-nawah-teal text-nawah-900 font-bold':'bg-nawah-700 text-slate-300 hover:bg-nawah-600'}`}>
            {t.icon}{t.label}
          </button>
        ))}
        {activeTool==='pen' && <input type="color" value={penColor} onChange={e=>setPenColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />}
        <div className="w-px h-6 bg-nawah-600 mx-1"/>
        {/* View mode toggle */}
        <button onClick={()=>setViewMode(v=>v==='iframe'?'canvas':'iframe')}
          className="px-3 py-1.5 rounded-lg text-xs bg-nawah-700 text-slate-300 hover:bg-nawah-600 whitespace-nowrap">
          {viewMode==='iframe'?'وضع الرسم':'عرض PDF'}
        </button>
        <div className="flex-1"/>
        <button onClick={()=>setZoom(z=>Math.min(z+0.25,2))} className="p-2 text-slate-400 hover:text-nawah-teal"><ZoomIn size={17}/></button>
        <span className="text-slate-400 text-xs">{Math.round(zoom*100)}%</span>
        <button onClick={()=>setZoom(z=>Math.max(z-0.25,0.5))} className="p-2 text-slate-400 hover:text-nawah-teal"><ZoomOut size={17}/></button>
        <button onClick={clearPage} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={17}/></button>
        <button onClick={saveData} disabled={saving}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-60 ${saved?'bg-green-500/20 text-green-400':'bg-nawah-teal/20 text-nawah-teal'}`}>
          {saving?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>}
          {saved?'تم!':'حفظ'}
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-slate-800/30">
        {pdfLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 size={36} className="animate-spin text-nawah-teal"/>
            <p className="text-slate-400">جاري تحميل الكتاب...</p>
          </div>
        )}

        {!pdfLoading && pdfError && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-8">
            <div className="text-5xl">📚</div>
            <h3 className="text-xl font-bold text-white" style={{fontFamily:'Noto Kufi Arabic, serif'}}>الكتاب غير متوفر بعد</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              سيتم رفع هذا الكتاب قريباً. يمكنك استخدام أدوات الرسم والملاحظات في الوضع التجريبي.
            </p>
            <button onClick={()=>{ setPdfError(false); setViewMode('canvas'); }} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
              استخدام وضع الرسم
            </button>
          </div>
        )}

        {!pdfLoading && !pdfError && pdfUrl && viewMode === 'iframe' && (
          <div className="relative w-full h-full" style={{minHeight:'70vh'}}>
            <iframe
              src={`${pdfUrl}#page=${page}`}
              className="w-full rounded-xl border border-nawah-700/40"
              style={{height:'75vh', minHeight:500}}
              title="كتاب مدرسي"
            />
            {/* Overlay canvas for drawing on top of iframe */}
            <canvas
              ref={drawRef}
              width={W}
              height={H}
              className="absolute top-0 right-0 pointer-events-none"
              style={{width:'100%', height:'75vh', opacity: activeTool!=='none'?1:0}}
            />
          </div>
        )}

        {(viewMode === 'canvas' || (!pdfLoading && !pdfError)) && viewMode === 'canvas' && (
          <div className="relative shadow-2xl flex-shrink-0" style={{width:W*zoom, height:H*zoom}}>
            <canvas ref={canvasRef} width={W} height={H} className="absolute inset-0" style={{width:W*zoom,height:H*zoom}}/>
            <canvas ref={drawRef} width={W} height={H} className="absolute inset-0"
              style={{width:W*zoom,height:H*zoom, cursor:activeTool==='pen'?'crosshair':activeTool==='highlight'?'cell':activeTool==='note'?'copy':'default'}}
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}/>
          </div>
        )}
      </div>

      {/* Page nav */}
      <div className="flex items-center justify-center gap-4 px-4 py-2.5 bg-nawah-800 border-t border-nawah-700 flex-shrink-0">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1} className="p-2 text-slate-400 hover:text-nawah-teal disabled:opacity-30"><ChevronRight size={20}/></button>
        <span className="text-white text-sm">صفحة <strong>{page}</strong> من <strong>{totalPages}</strong></span>
        <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="p-2 text-slate-400 hover:text-nawah-teal disabled:opacity-30"><ChevronLeft size={20}/></button>
      </div>

      {/* Note modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-nawah-800 rounded-2xl p-6 w-full max-w-sm border border-nawah-teal/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold" style={{fontFamily:'Noto Kufi Arabic, serif'}}>إضافة ملاحظة</h3>
              <button onClick={()=>setEditingNote(null)} className="text-slate-400 hover:text-red-400"><X size={18}/></button>
            </div>
            <textarea autoFocus value={editingNote.text} onChange={e=>setEditingNote({...editingNote,text:e.target.value})}
              className="w-full h-28 bg-nawah-700 border border-nawah-600 rounded-xl p-3 text-white text-sm resize-none" placeholder="اكتب ملاحظتك هنا..."/>
            <div className="flex gap-3 mt-4">
              <button onClick={saveNote} className="btn-primary flex-1 py-2.5 rounded-xl text-sm">حفظ</button>
              <button onClick={()=>setEditingNote(null)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
