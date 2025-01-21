using TheFreckExchange.Server.Repos;
using TheFreckExchange.Server.Services;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoConnection"));

builder.Services.AddSingleton<IAccountRepo, AccountRepo>();
builder.Services.AddSingleton<IProductRepo, ProductRepo>();
builder.Services.AddSingleton<IItemRepo, ItemRepo>();
builder.Services.AddSingleton<IImageRepo, ImageRepo>();
builder.Services.AddSingleton<IConfigRepo, ConfigRepo>();
builder.Services.AddSingleton<IAccountService, AccountService>();
builder.Services.AddSingleton<IProductService, ProductService>();
builder.Services.AddSingleton<ILoginService, LoginService>();
builder.Services.AddSingleton<IDataGatheringService, DataGatheringService>();
builder.Services.AddSingleton<IConfigService, ConfigService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "allowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration>(config =>
{
config.SetAzureTokenCredential(new DefaultAzureCredential());
});

builder.Services.AddApplicationInsightsTelemetry(new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions
{
    ConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]
});

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

app.UseCors("allowAll");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
