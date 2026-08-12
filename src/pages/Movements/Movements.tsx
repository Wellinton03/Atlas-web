import "./Movements.css";
import { useMemo, useState, useRef, ChangeEvent, MouseEvent } from "react";
import {
  Search,
  Calendar,
  Moon,
  Bell,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type MovementType = "EXPENSE" | "INCOME";

interface Movement {
  id: number;
  description: string;
  category: string;
  account: string;
  date: string; // ISO yyyy-mm-dd
  amount: number; // in BRL
  type: MovementType;
}

const MOCK: Movement[] = [
  { id: 1, description: "Supermercado Central", category: "Alimentação", account: "Nubank", date: "2025-10-14", amount: 245.8, type: "EXPENSE" },
  { id: 2, description: "Salário Mensal", category: "Receita", account: "Itaú", date: "2025-10-13", amount: 6500, type: "INCOME" },
  { id: 3, description: "Posto de Gasolina", category: "Transporte", account: "Nubank", date: "2025-10-12", amount: 180, type: "EXPENSE" },
  { id: 4, description: "Restaurante Mori", category: "Alimentação", account: "Inter", date: "2025-10-11", amount: 128.5, type: "EXPENSE" },
  { id: 5, description: "Aluguel", category: "Moradia", account: "Itaú", date: "2025-10-10", amount: 1800, type: "EXPENSE" },
  { id: 6, description: "Passagem aérea TAM", category: "Lazer", account: "Nubank", date: "2025-10-08", amount: 640, type: "EXPENSE" },
  { id: 7, description: "Freelance Design", category: "Receita", account: "Inter", date: "2025-10-05", amount: 1950, type: "INCOME" },
  { id: 8, description: "Academia", category: "Saúde", account: "Nubank", date: "2025-10-03", amount: 129, type: "EXPENSE" },
  { id: 9, description: "Netflix", category: "Lazer", account: "Itaú", date: "2025-10-02", amount: 55.9, type: "EXPENSE" },
  { id: 10, description: "Uber", category: "Transporte", account: "Nubank", date: "2025-10-01", amount: 42.3, type: "EXPENSE" },
];

function formatDateBR(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function Movements() {
  const [movements, setMovements] = useState<Movement[]>(MOCK);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | MovementType | "ALL_TYPES">("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    // default to current month
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // form state
  const [newType, setNewType] = useState<MovementType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [amountInput, setAmountInput] = useState(""); // masked string
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [category, setCategory] = useState("Alimentação");
  const [account, setAccount] = useState("Nubank");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const backdropRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return movements.filter((m) => {
      const matchesSearch = m.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "ALL" ? true : m.type === typeFilter;
      const month = m.date.slice(0, 7);
      const matchesMonth = !selectedMonth || month === selectedMonth;
      return matchesSearch && matchesType && matchesMonth;
    });
  }, [movements, search, typeFilter, selectedMonth]);

  const summary = useMemo(() => {
    const month = selectedMonth;
    const items = movements.filter((m) => m.date.slice(0, 7) === month);
    const incomes = items.filter((i) => i.type === "INCOME").reduce((s, c) => s + c.amount, 0);
    const expenses = items.filter((i) => i.type === "EXPENSE").reduce((s, c) => s + c.amount, 0);
    const balance = incomes - expenses;
    return { incomes, expenses, balance };
  }, [movements, selectedMonth]);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    clearForm();
    setErrors({});
  }

  function clearForm() {
    setNewType("EXPENSE");
    setDescription("");
    setAmountInput("");
    setDate(new Date().toISOString().slice(0, 10));
    setCategory("Alimentação");
    setAccount("Nubank");
  }

  function parseAmount(input: string) {
    const digits = input.replace(/[^0-9]/g, "");
    if (!digits) return 0;
    return Number(digits) / 100;
  }

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "");
    const num = Number(digits || "0");
    const formatted = (num / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setAmountInput(`R$ ${formatted}`);
  }

  function validateForm() {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = "Descrição é obrigatória";
    const amt = parseAmount(amountInput);
    if (!amountInput || amt <= 0) errs.amount = "Valor deve ser maior que zero";
    if (!date || Number.isNaN(new Date(date).getTime())) errs.date = "Data inválida";
    if (!category) errs.category = "Categoria é obrigatória";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;
    const amt = parseAmount(amountInput);
    const newMove: Movement = {
      id: Date.now(),
      description: description.trim(),
      category,
      account,
      date,
      amount: amt,
      type: newType,
    };
    setMovements((s) => [newMove, ...s]);
    closeModal();
    // ensure filters reflect new month selection optionally
  }

  function handleBackdropClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) closeModal();
  }

  return (
    <div className="movements">
      <header className="movements__header">
        <div className="movements__titles">
          <h1>Movimentações</h1>
          <p className="movements__subtitle">Acompanhe suas receitas e despesas em detalhes.</p>
        </div>

        <div className="movements__header-actions">
          <div className="movements__global-search">
            <input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} />
          </div>

          <button className="icon-btn"><Moon size={16} /></button>
          <button className="icon-btn"><Bell size={16} /></button>
          <button className="btn-primary" onClick={openModal}><Plus size={14} /> Nova movimentação</button>
        </div>
      </header>

      <section className="movements__filters">
        <div className="movements__filter-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="movements__filter-month">
          <Calendar size={16} />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="movements__filter-type">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
            <option value="ALL">Todas</option>
            <option value="EXPENSE">Despesas</option>
            <option value="INCOME">Receitas</option>
          </select>
        </div>
      </section>

      <section className="movements__summary">
        <div className="movements__summary-card">
          <div className="movements__summary-label">Ganhos do mês</div>
          <div className="movements__summary-value movements__summary-value--income">{formatCurrency(summary.incomes)}</div>
        </div>

        <div className="movements__summary-card">
          <div className="movements__summary-label">Gastos do mês</div>
          <div className="movements__summary-value movements__summary-value--expense">{formatCurrency(summary.expenses)}</div>
        </div>

        <div className="movements__summary-card">
          <div className="movements__summary-label">Saldo do mês</div>
          <div className="movements__summary-value movements__summary-value--balance">{formatCurrency(summary.balance)}</div>
        </div>
      </section>

      <section className="movements__table">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>CATEGORIA</th>
              <th>CONTA</th>
              <th>DATA</th>
              <th>VALOR</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="td-description">{m.description}</td>
                <td>
                  <span className="badge">{m.category}</span>
                </td>
                <td>{m.account}</td>
                <td>{formatDateBR(m.date)}</td>
                <td className={`td-amount ${m.type === "INCOME" ? "income" : "expense"}`}>
                  {m.type === "INCOME" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span className="amount-text">{formatCurrency(m.amount)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="movements__modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
          <div className="movements__modal" role="dialog" aria-modal="true">
            <div className="movements__modal-header">
              <h3>Nova movimentação</h3>
              <button className="icon-btn" onClick={closeModal}><X size={18} /></button>
            </div>

            <div className="movements__segmented">
              <button className={newType === "EXPENSE" ? "segmented active" : "segmented"} onClick={() => setNewType("EXPENSE")}>Despesa</button>
              <button className={newType === "INCOME" ? "segmented active" : "segmented"} onClick={() => setNewType("INCOME")}>Receita</button>
            </div>

            <div className="movements__form">
              <label>Descrição</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Almoço com cliente" />
              {errors.description && <div className="field-error">{errors.description}</div>}

              <label>Valor</label>
              <input value={amountInput} onChange={handleAmountChange} placeholder="R$ 0,00" />
              {errors.amount && <div className="field-error">{errors.amount}</div>}

              <label>Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              {errors.date && <div className="field-error">{errors.date}</div>}

              <label>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Alimentação</option>
                <option>Transporte</option>
                <option>Moradia</option>
                <option>Lazer</option>
                <option>Saúde</option>
                <option>Educação</option>
                <option>Receita</option>
                <option>Outros</option>
              </select>
              {errors.category && <div className="field-error">{errors.category}</div>}

              <div className="movements__form-actions">
                <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button className="btn-primary" onClick={handleSave}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
