import { useState } from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
`;

function ProjectFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <FiltersContainer>
      <input
        type="text"
        name="search"
        placeholder="Buscar proyecto..."
        value={filters.search}
        onChange={handleChange}
      />
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
      >
        <option value="all">Todos</option>
        <option value="pendiente">Pendiente</option>
        <option value="en-progreso">En Progreso</option>
        <option value="completado">Completado</option>
      </select>
    </FiltersContainer>
  );
}

export default ProjectFilters; 