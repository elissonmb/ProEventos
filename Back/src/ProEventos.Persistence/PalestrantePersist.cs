using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Context;
using ProEventos.Persistence.Interfaces;
using ProEventos.Persistence.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence
{
    public class PalestrantePersist : GeralPersist, IPalestrantePersist
    {
        private readonly ProEventosContext _context;

        public PalestrantePersist(ProEventosContext context) : base(context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        public async Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageparams, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.User)
                .Include(p => p.RedesSociais);

            if (includeEventos)
            {
                query = query
                    .Include(p => p.PalestrantesEventos)
                    .ThenInclude(pe => pe.Evento);
            }
            query = query
                .AsNoTracking().Where(
                p => p.Minicurriculo.ToLower().Contains(pageparams.Term.ToLower()) ||
                     p.User.PrimeiroNome.ToLower().Contains(pageparams.Term.ToLower()) ||
                     p.User.UltimoNome.ToLower().Contains(pageparams.Term.ToLower()) &&
                     p.User.Funcao == Domain.Enum.Funcao.Palestrante)
                .OrderBy(p => p.Id);

            return await PageList<Palestrante>.CreateAsync(query, pageparams.PageNumber, pageparams.PageSize);
        }
        public async Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.User)
                .Include(p => p.RedesSociais);
            if (includeEventos)
            {
                query = query
                    .Include(p => p.PalestrantesEventos)
                    .ThenInclude(pe => pe.Evento);
            }
            query = query
                .OrderBy(p => p.Id)
                .Where(p => p.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }


    }
}
