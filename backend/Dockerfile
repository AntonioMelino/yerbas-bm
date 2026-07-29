# Build explícito para Railway: Railpack (su builder por defecto) no reconoce
# YerbasBM.slnx (formato .slnx, más nuevo que el .sln clásico) y no logra
# detectar que esto es un proyecto .NET. Un Dockerfile tiene prioridad sobre
# la auto-detección, así que evita ese problema sin tocar el .slnx.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos solo los .csproj primero para cachear el restore entre builds
# mientras no cambien las dependencias.
COPY YerbasBM.Domain/YerbasBM.Domain.csproj YerbasBM.Domain/
COPY YerbasBM.Application/YerbasBM.Application.csproj YerbasBM.Application/
COPY YerbasBM.Infrastructure/YerbasBM.Infrastructure.csproj YerbasBM.Infrastructure/
COPY YerbasBM.API/YerbasBM.API.csproj YerbasBM.API/
RUN dotnet restore YerbasBM.API/YerbasBM.API.csproj

COPY . .
RUN dotnet publish YerbasBM.API/YerbasBM.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "YerbasBM.API.dll"]
