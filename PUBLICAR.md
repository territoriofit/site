# Site Território Fit — www.territoriofit.com.br

Hospedado no **GitHub Pages** (gratuito, sem mensalidade), conta GitHub `territoriofit`.
O Netlify não é mais usado (conta será cancelada).

## Como o site está publicado

- Repositório: https://github.com/territoriofit/site
- GitHub Pages servindo a branch `main` com o domínio `www.territoriofit.com.br` (arquivo `CNAME`).

## DNS na UOL (feito uma vez)

Painel UOL Host → Domínios → territoriofit.com.br → **Zona de DNS**:

| Tipo  | Nome (host) | Valor                    |
|-------|-------------|--------------------------|
| CNAME | www         | `territoriofit.github.io` |
| A     | @ (raiz)    | `185.199.108.153`        |
| A     | @ (raiz)    | `185.199.109.153`        |
| A     | @ (raiz)    | `185.199.110.153`        |
| A     | @ (raiz)    | `185.199.111.153`        |

Depois do DNS propagar: no GitHub → repositório `site` → Settings → Pages → marcar **Enforce HTTPS**.

## Como atualizar o site depois

Qualquer alteração nos arquivos de `C:\Users\Acer\territoriofit-site`:

```
git add -A
git commit -m "descrição da mudança"
git push
```

O site atualiza sozinho em ~1 minuto.

## O que já está configurado

- SEO: title otimizado pra "academia em São Carlos", meta description, canonical,
  Open Graph com foto (preview bonito no WhatsApp), schema.org ExerciseGym com horários.
- Horários: Seg–Qui 5h–23h · Sex 5h–22h · Sáb 8h–13h · Dom/feriados 8h–13h.
- Google Tag Manager: GTM-NKBLM8VK (mesmo do site antigo).
- Meta Pixel: 587932171772890 (mesmo do site antigo) + evento **Lead** disparado
  em todo clique de WhatsApp (usar como conversão nas campanhas!).
- Vídeo do hero: `videos/hero.mp4` (21s, 2,7MB, cortes do IMG_6562).
- Fotos: só as reais da academia.

## Pendência opcional

- Trocar o link "Veja mais avaliações no Google" pelo link direto do perfil da empresa.
