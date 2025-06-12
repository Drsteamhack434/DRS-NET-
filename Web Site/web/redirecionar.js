// Arreglo de URLs a redirigir
const urlsToRedirect = [
    "https://deep-drs.foroactivo.com/forum",
    "https://deep-drs.foroactivo.com/calendar",
    "https://deep-drs.foroactivo.com/faq",
    "https://deep-drs.foroactivo.com/memberlist",
    "https://deep-drs.foroactivo.com/groups",
    "https://deep-drs.foroactivo.com/privmsg?folder=inbox",
    "https://deep-drs.foroactivo.com/images"
];

// Nueva URL a la que se redirigirá
const redirectUrl = "https://deep-drs.foroactivo.com/";

// Verificar si la página actual es una de las URLs en el arreglo
if (urlsToRedirect.includes(window.location.href)) {
    // Redirigir a la nueva URL
    window.location.href = redirectUrl;
}
