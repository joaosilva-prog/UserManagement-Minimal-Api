using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using MinimalAPIProject.Data;
using MinimalAPIProject.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var mySqlConnection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));

var Origins = "_origensComAcessoPermitido";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: Origins, policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddRateLimiter(limiterOptions =>
{
    limiterOptions.AddFixedWindowLimiter("fixed", options =>
    {
        options.PermitLimit = 5;
        options.Window = TimeSpan.FromSeconds(10);
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 1;
    });
    limiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // endpoints 

app.UseCors(Origins);

app.UseRateLimiter();

async Task<List<UserModel>> GetUsers(AppDbContext context)
{
    return await context.Users.ToListAsync();
}

app.MapGet("/Users", async (AppDbContext context) =>
{
    return await GetUsers(context);
});

app.MapGet("/User/{id}", async (AppDbContext context, int id) =>
{
    var user = await context.Users.FindAsync(id);

    if (user is null)
    {
        return Results.NotFound(($"Usuário de Id = {id} não encontrado."));
    }

    return Results.Ok(user);
});

app.MapPost("/User", async (AppDbContext context, UserModel user) =>
{
    if (user is null)
    {
        return Results.BadRequest(($"Dados de usuário inválidos."));
    }
    else if (context.Users.Any(u => u.Id == user.Id))
    {
        return Results.BadRequest(($"Usuário já cadastrado."));
    }

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return Results.Ok(await GetUsers(context));
});

app.MapPut("/User", async (AppDbContext context, UserModel user) =>
{
    var userDb = await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == user.Id);

    if (userDb is null)
    {
        return Results.NotFound(($"Usuário não encontrado."));
    }

    userDb.Username = user.Username;
    userDb.Name = user.Name;
    userDb.Email = user.Email;

    context.Users.Update(user);
    await context.SaveChangesAsync();
    return Results.Ok(await GetUsers(context));
});

app.MapDelete("/User/Delete/{id}", async (AppDbContext context, int id) =>
{
    var userDb = await context.Users.FindAsync(id);

    if (userDb is null)
    {
        return Results.NotFound(($"Usuário de Id = {id} não encontrado."));
    }

    context.Users.Remove(userDb);
    await context.SaveChangesAsync();

    return Results.Ok(await GetUsers(context));
});

app.Run();

