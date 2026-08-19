import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { API_URL, MEDIA_URL, request } from '../../utils/request'

// TinyMCE 6 CDN'da o'zbek tili paketi yo'q (langs/uz.js -> 404), shuning uchun
// 'uz' tanlanganda tahrirlagich ingliz tilida qoladi — panelning qolgan qismi
// ham inglizcha bo'lgani uchun bu mos tushadi. Ilgari til qattiq 'ru' qilib
// qo'yilgandi va panel o'zbekcha bo'lsa ham menyular ruscha chiqardi.
const TINYMCE_LANGUAGES: Record<string, string | undefined> = {
  ru: 'ru',
  en: undefined,
  uz: undefined
}

interface IEditor {
  value: string
  setValue: React.Dispatch<
    React.SetStateAction<
      | any
      | {
          uz: string
          ru: string
          en: string
        }
      | string
    >
  >
  height?: number
  second?: boolean
  // Tashqaridan matn ichiga (kursor joyiga) kontent qo'shish uchun.
  // Eslatma/rasm tanlagich shu orqali kodni avtomatik joylaydi.
  insertRef?: React.MutableRefObject<((content: string) => void) | null>
}
function MyEditor(props: IEditor) {
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const { i18n } = useTranslation()
  const tinymceLanguage = TINYMCE_LANGUAGES[i18n.language?.split('-')[0]]
  const handleEditorChange = (content: any, editor: any) => {
    props.setValue(content)
  }
  const UPLOAD_ENDPOINT = 'dashboard/photo_upload'
  const useDarkMode = false

  return (
    <div
      style={{
        height: props.height
      }}
    >
      <Editor
        // Til init opsiyasi orqali beriladi va TinyMCE uni keyin o'zgartirmaydi —
        // key almashganda komponent qayta yaratilib, yangi tilda ochiladi.
        key={tinymceLanguage ?? 'en'}
        apiKey='tj15aigfz1e9z0eifck2ngkxy9vfv6hy86tl67i0pwxu85wn'
        onInit={(evt, editor) => {
          editorRef.current = editor
          if (props.insertRef) {
            // insertContent kursor turgan joyга qo'yadi (pastelash emas).
            props.insertRef.current = (content: string) => editor.insertContent(content)
          }
        }}
        value={props.value}
        // initialValue='<p>This is the initial content of the editor</p>'
        init={{
          branding: false,
          promotion: false,
          formats: {
            highlight: { inline: 'span', classes: 'highlight' },
            underline: { inline: 'u', exact: true }
          },
          // TinyMCE 6 (cloudChannel '6') ishlatiladi. Ro'yxatdan olib tashlanganlar:
          //   casechange, toc      -> premium plaginlar; API kalitida yoqilmagan,
          //                           shu sababli tahrirlagich ustida sariq
          //                           "premium plugin is not enabled" ogohlantirishi chiqardi
          //   print, paste, hr,
          //   noneditable          -> TinyMCE 6 da olib tashlangan (endi o'rnatilgan funksiya)
          //   imagetools           -> TinyMCE 6 da yo'q (premium 'editimage' ga ko'chgan)
          //   textpattern          -> TinyMCE 6 da 'text_patterns' opsiyasiga almashgan
          //   charmap              -> ro'yxatda ikki marta yozilgan edi
          plugins:
            'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons',
          menubar: 'file edit view insert format tools table help',
          max_height: props.height,
          convert_fonts_to_spans: false,
          language: tinymceLanguage,
          setup: (ed: any) => {
            ed?.onDesiredEvent?.add(function (editor: any, event: any) {
              var node = editor.selection.getNode()
              node.setAttribute('id', 'the_id_to_be_assigned')
            })
            ed.on('init', () => {
              ed.formatter.register('highlight', { inline: 'span', classes: 'highlight' })
            })
          },
          // 'hr' va 'print' tugmalari TinyMCE 6 da yo'q, 'casechange' — premium.
          toolbar:
            'code undo redo | fontfamily fontsize blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save | insertfile image media template link anchor codesample | ltr rtl',
          toolbar_sticky: true,
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          autosave_prefix: '{path}{query}-{id}-',
          autosave_restore_when_empty: false,
          autosave_retention: '2m',
          image_advtab: true,
          link_list: [
            {
              title: 'My page 1',
              value: 'https://gippokamp.murodjonovs.com/image/articles/araJ19Sc11.webp'
            },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_list: [
            {
              title: 'RASM',
              value: MEDIA_URL + '/svg/svgs/1_rasm.svg',
              width: 24,
              height: 15
            },
            {
              title: 'NOTE',
              value: MEDIA_URL + '/svg/svgs/2_note.svg',
              width: 24,
              height: 15
            },
            {
              title: 'PREMIUM NOTE',
              value: MEDIA_URL + '/svg/svgs/3_premium_note.svg',
              width: 24,
              height: 15
            },
            {
              title: 'GIPPONOTE',
              value: MEDIA_URL + '/svg/svgs/4_gipponote.svg',
              width: 24,
              height: 15
            },
            {
              title: 'DRUG',
              value: MEDIA_URL + '/svg/svgs/5_drug.svg',
              width: 24,
              height: 18
            },
            {
              title: 'Qoshimcha malumot',
              value: MEDIA_URL + '/svg/svgs/6_qushimcha_malumot.svg',
              width: 88,
              height: 24
            },
            {
              title: '+',
              value: MEDIA_URL + '/svg/svgs/7_note.svg',
              width: 24,
              height: 15
            },
            {
              title: 'VIDEO',
              value: MEDIA_URL + '/svg/svgs/8_video.svg',
              width: 24,
              height: 15
            },
            {
              title: 'MIYA',
              value: MEDIA_URL + '/svg/svgs/9_miya.svg',

              width: 30,
              height: 25
            },
            {
              title: 'CAUTION',
              value: MEDIA_URL + '/svg/svgs/10_caution.svg',
              width: 30,
              height: 26
            }
          ],
          image_class_list: [
            { title: 'None', value: '' },
            { title: 'Image', value: 'image-icon' },
            { title: 'Icon', value: 'image-icon-small' }
          ],
          importcss_append: true,
          file_picker_callback: function (cb) {
            var input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.onchange = function () {
              //@ts-ignore
              var file = this?.files[0]
              return new Promise((resolve, reject) => {
                const body = new FormData()
                body.append('folder', 'editor')
                body.append('image', file)
                // let headers = new Headers();
                // headers.append("Origin", "http://localhost:3000");
                request({
                  url: UPLOAD_ENDPOINT,
                  method: 'POST',
                  data: body,
                  headers: { 'Content-Type': 'multipart/form-data' }
                })
                  .then(res => {
                    cb(`${MEDIA_URL}/${res?.data?.data?.path}`, { title: file.name })
                    resolve(`${MEDIA_URL}/${res?.data?.data?.path}`)
                  })
                  .catch(err => {
                    reject(err)
                  })
              })
            }
            input.click()
          },
          templates: [
            {
              title: 'New Marker',
              description: 'creates a new marker',
              content:
                '<span id="marker" style="border-style: solid; border-top:0px; border-left: 0px; border-right:0px;border-bottom:2px solid yellow;">Write your marker</span>'
            },
            {
              title: 'Qo`shimcha ma`lumot',
              description: 'A cure for writers block',
              content:
                '<p id="addintional-info style="display:block"><strong>Qo`shimcha ma`lumot:</strong> Always declare the border-bottom-style or the border-style property before the border-bottom-color property. An element must have a border before you can change the color.</p>'
            }
          ],
          template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
          height: 600,
          image_caption: true,
          //   quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_noneditable_class: 'mceNonEditable',
          toolbar_mode: 'floating',
          //   contextmenu: 'link image imagetools table',
          skin: useDarkMode ? 'oxide-dark' : 'oxide',
          content_css: useDarkMode ? 'dark' : 'default',
          content_style:
            "@import url('https://fonts.cdnfonts.com/css/gilroy');" +
            "@import url('https://fonts.googleapis.com/css?family=Open+Sans');" +
            "@import url('https://fonts.googleapis.com/css?family=Calibri:400,700,400italic,700italic');" +
            'body { font-family:Calibri,Arial,sans-serif; font-size:12px }' +
            'p { font-family:Calibri,Arial,sans-serif; font-size:12px }' +
            '.image-icon { width: 100px; height: 100px; border-radius: 10px; border: 2px solid #000; object-fit: cover;}' +
            '.image-icon-small { width: 10px; height: 10px; border-radius: 2px; border: 1px solid #000; }',
          font_family_formats:
            'Calibri=Calibri;Gilroy=gilroy; OpenSans=OpenSans;  Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          //@ts-ignore
          images_upload_handler: function (blobInfo, success, failure) {
            return new Promise((resolve, reject) => {
              const body = new FormData()
              body.append('image', blobInfo.blob(), blobInfo.filename())
              fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
                method: 'post',
                body: body
                // mode: "no-cors"
              })
                .then(res => res.json())
                .then(res => {
                  resolve(`${API_URL}/${res.image}`)
                })
                .catch(err => {
                  reject(err)
                })
            })
          }
        }}
        onEditorChange={handleEditorChange}
        // onBlur={handleEditorChange}
        outputFormat='html'
        // toolbar='code'
      />
    </div>
  )
}

export default MyEditor
