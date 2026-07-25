using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace YerbasBM.Application.Common;

/// <summary>
/// Genera slugs URL-friendly a partir de un texto (ej. "Yerba Mate" -> "yerba-mate"),
/// sacando acentos y caracteres no alfanuméricos.
/// </summary>
public static class SlugGenerator
{
    /// <summary>Convierte un texto libre en un slug en minúsculas separado por guiones.</summary>
    public static string Generate(string value)
    {
        var normalized = RemoveDiacritics(value.Trim().ToLowerInvariant());
        normalized = Regex.Replace(normalized, @"[^a-z0-9\s-]", "");
        normalized = Regex.Replace(normalized, @"[\s-]+", "-").Trim('-');
        return normalized;
    }

    private static string RemoveDiacritics(string text)
    {
        var decomposed = text.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();

        foreach (var c in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(c);
            }
        }

        return builder.ToString().Normalize(NormalizationForm.FormC);
    }
}
