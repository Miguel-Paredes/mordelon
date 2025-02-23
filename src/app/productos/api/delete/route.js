import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function DELETE(request) {
  try {
    // Parsear el cuerpo de la solicitud como JSON
    const { publicId } = await request.json();

    if (!publicId) {
      return new Response(JSON.stringify({ error: 'No publicId provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Eliminar la imagen de Cloudinary
    const url = `next/${publicId}`;
    const result = await cloudinary.v2.uploader.destroy(url);
    console.log("Cloudinary Delete Result:", result); // Verificar la respuesta de Cloudinary
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error); // Verificar errores
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}