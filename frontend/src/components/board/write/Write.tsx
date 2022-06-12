import { useState, useCallback, useEffect, useMemo, useRef} from 'react';
import ReactQuill from 'react-quill';
import { RangeStatic } from 'quill';
import { useNavigate, useParams } from 'react-router-dom';
import { IFilesTypes } from '../../Interfaces';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import './write.scss';

export const Write:React.FC = ():JSX.Element => {
    const { uuid, id } = useParams();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [form, setForm] = useState(new FormData());
    const [files, setFiles] = useState<IFilesTypes[]>([]);
    const quillRef = useRef<ReactQuill>();
    let index = 0; 
    const navigate = useNavigate();
    
    useEffect(() => {
        if (id) {
            axios.get(`/${uuid}/selDetail/${id}`)
            .then((res: any) => {
                if (res.data[1].length > 0) {
                    let resFiles: IFilesTypes[] = [];
    
                    for (let i = 0; i < res.data[1].length; i++) {
                        resFiles[i] = {
                            id: res.data[1][i].id,
                            name: res.data[1][i].name,
                            size: res.data[1][i].size,
                            state: res.data[1][i].state
                        }
                    }
    
                    setFiles(resFiles);
                }

                setTitle(res.data[0][0].title);

                quillRef.current?.getEditor().clipboard.dangerouslyPasteHTML(res.data[0][0].content);
            });
        }
    }, [uuid, id, navigate, index]);
    
    const onTitleChange = useCallback((e) => {
        const { value } = e.target;
        setTitle(value);
    }, []);

    const insertHandler = useCallback(() => {
        let fileId = [];
        let idx = 0;
        for (let i = 0; i < files.length; i++) {
            if (files[i].file) {
                form.append(''+idx++, files[i].file as File);
            } else {
                fileId.push(files[i].dbId);
            }
        }
        form.append('fileId', JSON.stringify(fileId));

        if (title.length < 1 || content.length < 1 || content === '<p><br></p>') {
            alert('제목 또는 내용을 입력해 주세요.');
        } else {
            if (id) { // 수정 로직
                form.append('id', id);
                form.append('title', title);
                form.append('content', content);
                axios.post('/api/updNotice.php', form)
                .then((res) =>  {
                    setForm(new FormData());
                    
                    alert('공지글 수정을 완료했습니다.');
                    navigate('/'+uuid+'/'+id);
                });
            } else { // 삽입 로직      
                form.append('title', title);
                form.append('content', content);  
                axios.post('/api/insNotice.php', form)
                .then((res) => {
                    alert('공지글 작성을 완료했습니다.');
                    navigate('/'+uuid+'/'+res.data);
                });
            }
        }
    }, [title, content, id, uuid, form, files, navigate]);

    const cancel = useCallback(() => {
        if (title.length > 0 || content.length > 0) {
            if (window.confirm('작성 중이던 글은 저장 되지 않습니다.\n글쓰기를 취소하시겠습니까?')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    }, []);

    // 파일 핸들러
    const fileHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.xlsx, .xls, .doc, .docx, .ppt, .pptx, .txt, .pdf, .hwp');
        input.click();

        input.onchange = async () => {
            const file = input.files;

            if (file) {
                const fileInfo:IFilesTypes = {id: index++, name: file[0].name, size: ''+file[0].size, file:file[0], state: 0};
                setFiles(files => [...files, fileInfo]);
            }
        }
    }, [setFiles, index]);

    // byte 단위 변환 함수
    const formatByte = (bytes:number, decimals = 2) => { 
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // 첨부파일 삭제
    const fileDelete = useCallback(async (e) => {
        if (window.confirm('첨부파일을 삭제하겠습니까?')) {
            // files에 state가 있으면 axios로 db state값 2로 update and 파일 지우기
            for (let i = 0; i < files.length; i++) {
                if (files[i].id === e && files[i].dbId) {
                    const id = files[i].dbId;
                    let name = files[i].name;
                    const result = name.split(".");
                    name = result[1];
                    const res = await axios.post('/api/delFile.php', JSON.stringify({id, name}));
                }
            }
            setFiles(files.filter(f => f.id !== e));
        }
    }, [setFiles, files]);

    // 이미지 핸들러
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files;
            const form = new FormData();

            if (file) {
                form.append('image', file[0]);

                const res = await axios.post('/api/uploadImage.php', form);

                if (quillRef.current) {
                    const index = (quillRef.current.getEditor().getSelection() as RangeStatic).index;

                    const quillEditor = quillRef.current.getEditor();
                    quillEditor.setSelection(index, 1);

                    quillEditor.clipboard.dangerouslyPasteHTML(
                        index,
                        `<img src=${res.data} alt='미리보기 이미지'/>`
                    );
                }
            }
        }
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] },
                ],
                ["image", "link"],
            ],
            handlers: {
                link: fileHandler,
                image: imageHandler,
            },
        },
    }), []);

    return (
        <div className="noticeWrite">
            <div className="noticeWrite-title">
                <input type="text" autoFocus placeholder='제목을 입력하세요.' defaultValue={title} onChange={onTitleChange}/>
            </div>
            
            <div className="noticeWrite-content">
                <div className="editor">
                    <div className="editor-quill">
                        <ReactQuill 
                            className="editor-content"
                            ref={(element) => {
                                if (element !== null) {
                                quillRef.current = element;
                                }
                            }}
                            modules={modules} 
                            defaultValue={content}
                            placeholder='내용을 입력하세요.'
                            onChange={setContent}
                        />
                    </div>
                    <div className="editor-attachArea">첨부파일</div>
                    <div className="editor-attach">
                        {
                        files.filter(f => f.state)
                        .map((file) => {
                                return (
                                <div key={file.id} className='editor-attach-info'>
                                    <span>{file.name}</span>
                                    <span>
                                        <span>{formatByte(parseInt(file.size))}</span>
                                        <span onClick={() => fileDelete(file.id)} className="editor-attach-info-x">&#215;</span>
                                    </span>
                                </div>
                                )
                            }
                        )
                        }
                    </div>
                </div>
            </div>

            <div className="noticeWrite-btn">
                <span className="btn" onClick={insertHandler}>등록</span>
                <span className="btn" onClick={cancel}>취소</span>
            </div>
        </div>
    );
}