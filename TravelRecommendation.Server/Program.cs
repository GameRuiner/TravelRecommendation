using MongoDB.Driver;
using System.Diagnostics;
using TravelRecommendation.Server;

var builder = WebApplication.CreateBuilder(args);

// Add MongoDB configuration

builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection(nameof(MongoDBSettings)));

builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    if (settings is null)
    {
        throw new InvalidOperationException("MongoDBSettings is not configured correctly.");
    }
    return new MongoClient(connectionString: settings.ConnectionString);
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<HotelService>();

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

StartMongoDB();

app.Run();

void StartMongoDB()
{
    var processStartInfo = new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = "/c mongod --config D:\\Programming\\MongoDB\\Server\\7.0\\bin\\mongod.cfg",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    using (var process = Process.Start(processStartInfo))
    {
        if (process != null)
        {
            string output = process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();

            Debug.WriteLine("MongoDB Output: " + output);
            if (!string.IsNullOrEmpty(error))
            {
                Debug.WriteLine("MongoDB Error: " + error);
            }

            process.WaitForExit();
        }
    }
}
