import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../styles/shared';
import { TECHNOLOGIES_OPTIONS, CATEGORY_OPTIONS } from '../../utils/projectOptions';

const FiltersContainer = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
`;

const FiltersForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  min-width: 200px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  min-width: 200px;
`;

const FilterButton = styled(Button)`
  height: fit-content;
  margin-top: auto;
`;

function ProjectFilters({ onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    technology: '',
    category: ''
  });

  const handleInputChange = (field, value) => {
    console.log('Cambiando filtro:', field, value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Aplicando filtros:', localFilters);
    onFilterChange(localFilters);
  };

  return (
    <FiltersContainer>
      <FiltersForm onSubmit={handleSubmit}>
        <FilterGroup>
          <Label>Buscar</Label>
          <Input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Buscar proyectos..."
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Tecnología</Label>
          <Select
            value={localFilters.technology}
            onChange={(e) => handleInputChange('technology', e.target.value)}
          >
            <option value="">Todas</option>
            {TECHNOLOGIES_OPTIONS.map(tech => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Categoría</Label>
          <Select
            value={localFilters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">Todas</option>
            {CATEGORY_OPTIONS.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterButton type="submit">
          Aplicar filtros
        </FilterButton>
      </FiltersForm>
    </FiltersContainer>
  );
}

export default ProjectFilters; 