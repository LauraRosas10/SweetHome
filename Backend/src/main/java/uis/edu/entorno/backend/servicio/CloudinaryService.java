package uis.edu.entorno.backend.servicio;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
        @Value("${cloudinary.cloud_name}") String cloudName,
        @Value("${cloudinary.api_key}") String apiKey,
        @Value("${cloudinary.api_secret}") String apiSecret
    ) {
        Map<String, String> config = ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        );
        this.cloudinary = new Cloudinary(config);
    }

    public String upload(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Archivo vacío");
        String ct = file.getContentType();
        if (ct == null || !ct.startsWith("image/")) throw new IllegalArgumentException("Solo imágenes");
        Map<?,?> result = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap("folder", folder, "resource_type", "image"));
        return result.get("secure_url").toString();
    }
}
