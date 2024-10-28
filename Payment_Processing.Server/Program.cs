using Payment_Processing.Server.DTO;
using Payment_Processing.Server.Repos;
using Payment_Processing.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoConnection"));

// Add services to the container.
builder.Services.AddSingleton<IAccountRepo, AccountRepo>();
builder.Services.AddSingleton<IAccountService,AccountService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
