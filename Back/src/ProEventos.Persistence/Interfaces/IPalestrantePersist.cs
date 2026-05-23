using ProEventos.Domain;
using ProEventos.Persistence.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Interfaces
{
    public interface IPalestrantePersist : IGeralPersist
    {
        //PALESTRANTES
        Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageparams, bool includeEventos = false);
        Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);



    }
}
