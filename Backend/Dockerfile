# Use the official image as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
RUN dotnet restore
EXPOSE 5001

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["greenBayAPI.csproj", "./"]
RUN dotnet restore "./greenBayAPI.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "greenBayAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "greenBayAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "greenBayAPI.dll"]
