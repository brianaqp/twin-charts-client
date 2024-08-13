import { Pipe, PipeTransform } from '@angular/core';
import { PortDataset, KeyItem } from '../interfaces/data';

@Pipe({
  name: 'filterInPort',
  standalone: true,
})
export class FilterInPortPipe implements PipeTransform {
  transform(value: PortDataset, searchInput: string): any[] {
    if (!value) return [];
    if (!searchInput) return value;

    // Dividir el searchInput en términos de búsqueda separados por comas
    const searchTerms = searchInput
      .split(',')
      .map((term) => term.trim().toLowerCase());

    // Crear un conjunto para almacenar los resultados únicos
    const resultSet = new Set<KeyItem>();

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
