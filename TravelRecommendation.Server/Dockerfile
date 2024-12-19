# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["TravelRecommendation.Server.csproj", "./"]
RUN dotnet restore "./TravelRecommendation.Server.csproj"
COPY . .


# Install tools for file change detection (optional, for Linux environments)
RUN apt-get update && apt-get install -y inotify-tools

# Enable hot reload
CMD ["dotnet", "watch", "run", "--no-launch-profile", "--urls=http://0.0.0.0:8080"]

# Production build image
FROM dev AS build
ARG BUILD_CONFIGURATION=Release
RUN dotnet build "./TravelRecommendation.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TravelRecommendation.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Copy the .env file
COPY .env /app/.env

# Set environment variables directly from the .env file
RUN export $(grep -v '^#' /app/.env | xargs -d '\n') && \
    env | grep BEARER_TOKEN # Optional: Debugging step to verify variables

# Final runtime setup
CMD ["dotnet", "TravelRecommendation.Server.dll"]