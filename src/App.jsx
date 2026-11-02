import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Flame } from 'lucide-react';

const STORAGE_KEY = 'tamdan_state_v1';

export default function App() {
  const today = new Date().toISOString().split('T')[0];

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lastDate !== today) {
          return {
            lastDate: today,
            routines: parsed.routines.map(r => ({
              ...r,
              streak: r.done ? r.streak + 1 : 0,
              done: false
            })),
            todos: parsed.todos.filter(t => !t.done)
          };
        }
        return parsed;
      } catch (e) {
        console.error("Failed to load local state", e);
      }
    }
    return {
      lastDate: today,
      routines: [
        { id: 'r1', text: 'Morning stretch / hydration', done: false, streak: 0 },
        { id: 'r2', text: 'Deep work block (90 mins)', done: false, streak: 0 },
        { id: 'r3', text: 'Evening review & tomorrow prep', done: false, streak: 0 }
      ],
      todos: []
    };
  });

  const [newTodo, setNewTodo] = useState('');
  const [newRoutine, setNewRoutine] = useState('');
  const [showAddRoutine, setShowAddRoutine] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleRoutine = (id) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.map(r => r.id === id ? { ...r, done: !r.done } : r)
    }));
  };

  const toggleTodo = (id) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    }));
  };

  const deleteTodo = (id) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setState(prev => ({
      ...prev,
      todos: [...prev.todos, { id: 't_' + Date.now(), text: newTodo.trim(), done: false }]
    }));
    setNewTodo('');
  };

  const handleAddRoutine = (e) => {
    e.preventDefault();
    if (!newRoutine.trim()) return;
    setState(prev => ({
      ...prev,
      routines: [...prev.routines, { id: 'r_' + Date.now(), text: newRoutine.trim(), done: false, streak: 0 }]
    }));
    setNewRoutine('');
    setShowAddRoutine(false);
  };

  const totalItems = state.routines.length + state.todos.length;
  const completedItems = state.routines.filter(r => r.done).length + state.todos.filter(t => t.done).length;
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex justify-center p-4">
      <main className="w-full max-w-md space-y-6 pt-6 pb-12">
        <header className="flex justify-between items-baseline border-b border-zinc-800/80 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">TamDan</h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            {progressPct}% Done
          </span>
        </header>

        {/* Daily Routine */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Daily Routines</h2>
            <button 
              onClick={() => setShowAddRoutine(!showAddRoutine)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              {showAddRoutine ? 'Cancel' : '+ Add Habit'}
            </button>
          </div>

          {showAddRoutine && (
            <form onSubmit={handleAddRoutine} className="flex gap-2">
              <input
                type="text"
                value={newRoutine}
                onChange={(e) => setNewRoutine(e.target.value)}
                placeholder="New daily habit..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
                autoFocus
              />
              <button type="submit" className="bg-zinc-200 text-zinc-900 px-3 py-2 rounded-lg text-sm font-semibold">
                Add
              </button>
            </form>
          )}

          <div className="space-y-2">
            {state.routines.map(item => (
              <div 
                key={item.id}
                onClick={() => toggleRoutine(item.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition select-none cursor-pointer ${
                  item.done 
                    ? 'bg-zinc-900/30 border-zinc-900 text-zinc-500 line-through' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    item.done ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-600'
                  }`}>
                    {item.done && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500/90 font-mono">
                  <Flame size={14} />
                  <span>{item.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Today's Tasks</h2>

          <form onSubmit={handleAddTodo} className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to get done?"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
            <button type="submit" className="bg-zinc-200 text-zinc-900 px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center">
              <Plus size={16} />
            </button>
          </form>

          <div className="space-y-2">
            {state.todos.length === 0 ? (
              <p className="text-xs text-zinc-600 py-3 text-center">No one-off tasks yet.</p>
            ) : (
              state.todos.map(todo => (
                <div 
                  key={todo.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  <div 
                    onClick={() => toggleTodo(todo.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      todo.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-600'
                    }`}>
                      {todo.done && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm ${todo.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-zinc-600 hover:text-red-400 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}