    using AutoMapper;
using Microsoft.Extensions.Logging;
using ProEventos.Application.Dtos;
using ProEventos.Application.Interfaces;
using ProEventos.Persistence.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Domain

{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IMapper _mapper;
        private readonly IRedeSocialPersist _redeSocialPersist;

        public RedeSocialService(IRedeSocialPersist redeSocialPersist, IMapper mapper)
        {
            _mapper = mapper;
            _redeSocialPersist = redeSocialPersist;
        }
        public async Task AddRedeSocial(int Id, RedeSocialDto model, bool isEvento)
        {
            try
            {
                var redeSocial = _mapper.Map<RedeSocial>(model);
                

                _redeSocialPersist.Add<RedeSocial>(redeSocial);
                if (isEvento)
                {
                    redeSocial.EventoId = Id;
                    redeSocial.PalestranteId = null;
                }
                else {
                    redeSocial.EventoId = null;
                    redeSocial.PalestranteId = Id;
                }

                    await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDto[]> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                var RedeSocial = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if (RedeSocial == null) return null;
                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(eventoId, model, true);
                    }
                    else
                    {
                        var redeSocial = RedeSocial.FirstOrDefault(redeSocial => redeSocial.Id == model.Id);
                        model.EventoId = eventoId;
                        _mapper.Map(model, redeSocial);
                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }
            var redeSocialRetorno = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<RedeSocialDto[]> SaveByPalestrante(int palestranteId, RedeSocialDto[] models)
        {
            try
            {
                var RedeSocial = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if (RedeSocial == null) return null;
                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }
                    else
                    {
                        var redeSocial = RedeSocial.FirstOrDefault(redeSocial => redeSocial.Id == model.Id);
                        model.PalestranteId = palestranteId;
                        _mapper.Map(model, redeSocial);
                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }
                var redeSocialRetorno = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) throw new Exception("Rede Social por evento para delete não encontrada.");

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null) throw new Exception("Rede Social por palestrante para delete não encontrada.");

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByEventoIdAsync(int eventoId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if (redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int palestranteId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if (redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) return null;
                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null) return null;
                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
    }
}