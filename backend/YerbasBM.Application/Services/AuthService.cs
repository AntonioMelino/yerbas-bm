using YerbasBM.Application.DTOs;
using YerbasBM.Application.Interfaces;

namespace YerbasBM.Application.Services;

/// <summary>
/// Implementación de <see cref="IAuthService"/>: valida las credenciales del
/// admin contra el hash almacenado y delega la emisión del token en <see cref="ITokenGenerator"/>.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IAdminUserRepository _adminUserRepository;
    private readonly ITokenGenerator _tokenGenerator;

    public AuthService(IAdminUserRepository adminUserRepository, ITokenGenerator tokenGenerator)
    {
        _adminUserRepository = adminUserRepository;
        _tokenGenerator = tokenGenerator;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var adminUser = await _adminUserRepository.GetByUsernameAsync(dto.Username.Trim());
        if (adminUser is null || !BCrypt.Net.BCrypt.Verify(dto.Password, adminUser.PasswordHash))
        {
            return null;
        }

        var (token, expiresAtUtc) = _tokenGenerator.GenerateToken(adminUser);

        return new LoginResponseDto
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            Username = adminUser.Username
        };
    }
}
