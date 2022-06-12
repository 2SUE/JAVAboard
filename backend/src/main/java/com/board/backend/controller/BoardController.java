package com.board.backend.controller;

import com.board.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @PostMapping("/access")
    public String access(@RequestBody Map<String, String> param) {
        return boardService.access(param.get("password"));
    }

    @GetMapping("/{uuid}/selList")
    public List selList(@PathVariable("uuid") String uuid, @RequestParam("page") int page) {
        return boardService.selList(uuid, page);
    }

    @PostMapping("/{uuid}/updViewCount")
    public void updViewCount(@PathVariable("uuid") String uuid, @RequestBody Map<String, Integer> param) {
        boardService.updViewCount(uuid, param.get("id"));
    }

    @GetMapping("/{uuid}/selDetail/{id}")
    public List selDetail(@PathVariable("uuid") String uuid, @PathVariable("id") int id) {
        return boardService.selDetail(uuid, id);
    }

    @PostMapping("/{uuid}/delBoard/{id}")
    public void delBoard(@PathVariable("uuid") String uuid, @PathVariable("id") int id) {
        boardService.delBoard(uuid, id);
    }

    @GetMapping("/{uuid}/fileDownload/{fId}/{ext}")
    public ResponseEntity<Object> fileDownload(String uuid, @PathVariable("fId") int id, @PathVariable("ext") String ext) {
        return boardService.fileDownload(id, ext);
    }
}