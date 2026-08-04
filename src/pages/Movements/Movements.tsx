import "./Movements.css";

export default function Movements() {
  return (
    <div className="movements-page">
      <header className="page-header">
        <div>
          <h1>Movimentações</h1>
          <p>Acompanhe suas receitas e despesas.</p>
        </div>

        <button className="btn-primary">Nova movimentação</button>
      </header>

      <section className="filters">
        <input
          type="text"
          placeholder="Buscar por descrição..."
          className="input"
        />

        <input type="month" className="input" />

        <select className="input">
          <option>Todas</option>
          <option>Receita</option>
          <option>Alimentação</option>
          <option>Moradia</option>
          <option>Transporte</option>
          <option>Lazer</option>
          <option>Saúde</option>
        </select>
      </section>

      <section className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Conta</th>
              <th>Data</th>
              <th>Valor</th>
            </tr>
          </thead>

          <tbody>{/* Os dados virão do backend */}</tbody>
        </table>
      </section>
    </div>
  );
}
