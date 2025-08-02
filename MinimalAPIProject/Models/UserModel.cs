using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace MinimalAPIProject.Models
{
    public class UserModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
    }
}
