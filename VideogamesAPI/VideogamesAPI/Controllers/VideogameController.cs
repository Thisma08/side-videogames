using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogamesAPI.Data;

namespace VideogamesAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideogameController : ControllerBase {
    private readonly DatabaseContext _context;

    public VideogameController(DatabaseContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Videogame>>> GetVideogames()
    {
        return await _context.Videogames.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Videogame>> GetVideogames(int id)
    {
        var v = await _context.Videogames.FindAsync(id);

        if (v == null)
        {
            return NotFound();
        }

        return v;
    }
    
    [HttpPost]
    public async Task<ActionResult<Videogame>> PostVideogames(Videogame videogame)
    {
        _context.Videogames.Add(videogame);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVideogames), new { id = videogame.Id }, videogame);
    }
}