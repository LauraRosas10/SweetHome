package uis.edu.entorno.backend.servicio;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
	@Autowired
    private Cloudinary cloudinary;

    /**
     * Sube un archivo a Cloudinary en la carpeta indicada y devuelve la URL segura.
     *
     * @param file     MultipartFile que llega desde el front
     * @param carpeta  carpeta destino en Cloudinary (por ejemplo "sweet_home/products/123")
     * @return URL segura de la imagen subida
     * @throws IOException si falla la carga
     */
    public String subirImagen(MultipartFile file, String carpeta) throws IOException {
        Map<?, ?> params = ObjectUtils.asMap(
            "folder", carpeta,
            "resource_type", "auto"
        );
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
        return uploadResult.get("secure_url").toString();
    }
}
