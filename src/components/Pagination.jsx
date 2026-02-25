const Pagination = ({ pagination, onPageChange }) => {
  const { current_page, total_pages } = pagination;
  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${current_page === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(current_page - 1)}
          >
            &laquo;
          </button>
        </li>
        {[...Array(total_pages)].map((_, i) => (
          <li
            key={i}
            className={`page-item ${current_page === i + 1 ? "active" : ""}`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${current_page === total_pages ? "disabled" : ""}`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(current_page + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
