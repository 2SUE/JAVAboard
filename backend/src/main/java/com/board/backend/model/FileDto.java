package com.board.backend.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FileDto {
    private Long id;
    private Long board_id;
    private String name;
    private int size;
    private Boolean state;
}
