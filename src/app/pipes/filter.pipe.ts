import { Pipe, PipeTransform } from '@angular/core';
import { LitoralItem } from '../interfaces/data';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: LitoralItem[], searchInput: string): LitoralItem[] {
    if (!searchInput) {
      return value;
    }

    // Dividir el searchInput en términos de búsqueda separados por comas
    const searchTerms = searchInput
      .split(',')
      .map((term) => term.trim().toLowerCase());

    // Crear un conjunto para almacenar los resultados únicos
    const resultSet = new Set<LitoralItem>();

    // Si despues de una coma no hay nada, no se toma en cuenta esa busqueda
    if (searchTerms[searchTerms.length - 1] === '') {
      searchTerms.pop();
    }

    // Filtrar el arreglo aplicando cada término de búsqueda y agregar los resultados al conjunto
    searchTerms.forEach((term) => {
      value
        .filter((item) => item.name.toLowerCase().includes(term))
        .forEach((item) => resultSet.add(item));
    });

    // Convertir el conjunto de nuevo a un arreglo y retornarlo
    return Array.from(resultSet);
  }
}
