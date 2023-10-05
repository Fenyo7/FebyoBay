# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /Src
COPY . .
RUN ls -al /Src
RUN dotnet restore ./Src/greenBayAPI.csproj
RUN dotnet publish ./Src/greenBayAPI.csproj -c Release -o /app/publish

# Use the official image as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "greenBayAPI.dll"]
