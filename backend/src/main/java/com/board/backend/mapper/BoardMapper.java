package com.board.backend.mapper;

import com.board.backend.model.BoardDto;
import com.board.backend.model.FileDto;
import org.apache.ibatis.annotations.Mapper;

import java.io.File;
import java.util.List;

@Mapper
public interface BoardMapper {
    int selTotalList();
    List<BoardDto> selList(int page);
    void updViewCount(Integer id);
    List<BoardDto> selDetail(int id);
    List<FileDto> selFile(int id);
    void delBoard(int id);
}