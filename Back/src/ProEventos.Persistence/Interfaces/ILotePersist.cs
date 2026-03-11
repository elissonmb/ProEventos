using ProEventos.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Interfaces
{
    public interface ILotePersist
    {
        /// <summary>
        /// Método para obter os lotes de um evento específico, utilizando o ID do evento como parâmetro.
        /// </summary>
        /// <param name="eventoId"></param>
        /// <returns></returns>

        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// Método para obter um lote específico de um evento, utilizando o ID do evento e o ID do lote como parâmetros.
        /// </summary>
        /// <param name="eventoId"></param>
        /// <param name="loteId"></param>
        /// <returns></returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId);
    }
}
