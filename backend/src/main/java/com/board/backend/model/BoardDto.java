package com.board.backend.model;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BoardDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime reg_date;
    private Boolean state;
    private LocalDateTime last_update;
    private Long view_count;
}
