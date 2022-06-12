package com.board.backend.service;

import com.board.backend.mapper.BoardMapper;
import com.board.backend.model.FileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper boardMapper;

    @Value("${pw}")
    private String PW;

    private String RAN = "";

    public String ran() {
        return UUID.randomUUID().toString().toUpperCase().replace("-", "").substring(0, 5);
    }

    public String access(String param) {
        String result = "";

        if (PW.equals(param)) {
            RAN = ran();
            result = RAN;
        }

        return result;
    }

    public List selList(String uuid, int page) {
        List result = new ArrayList();

        if (RAN.equals(uuid)) {
            result.add(boardMapper.selTotalList());
            result.add(boardMapper.selList(page*10));
        }

        return result;
    }

    public void updViewCount(String uuid, Integer id) {
        if (RAN.equals(uuid)) {
            boardMapper.updViewCount(id);
        }
    }

    public List selDetail(String uuid, int id) {
        List result = new ArrayList();

        if (RAN.equals(uuid)) {
            result.add(boardMapper.selDetail(id));
            result.add(boardMapper.selFile(id));
        }

        return result;
    }

    public void delBoard(String uuid, int id) {
        if (RAN.equals(uuid)) {
            boardMapper.delBoard(id);
        }
    }

    public ResponseEntity<Object> fileDownload(int id, String ext) {
        String path = "C:\\Users\\dongb\\Desktop\\file\\link\\" + id + "." + ext;
        System.out.println(path);

        try {
            Path filePath = Paths.get(path);
            Resource resource = new InputStreamResource(Files.newInputStream(filePath));

            File file = new File(path);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDisposition(ContentDisposition.builder("attachment").build());

            return new ResponseEntity<Object>(resource, headers, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<Object>(null, HttpStatus.CONFLICT);
        }
    }
}