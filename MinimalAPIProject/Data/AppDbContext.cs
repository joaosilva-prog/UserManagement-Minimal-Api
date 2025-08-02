using Microsoft.EntityFrameworkCore;
using MinimalAPIProject.Models;

namespace MinimalAPIProject.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<UserModel> Users { get; set; } // mapeando o Model para o DB
    }
}
