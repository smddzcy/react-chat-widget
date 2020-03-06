/* eslint-disable no-unused-expressions */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import noop from 'lodash/noop';
import ReactS3Uploader from 'react-s3-uploader';
import S3Upload from 'react-s3-uploader/s3upload';
import isImage from 'is-image';
import Compressor from 'compressorjs';
import { Circle } from 'rc-progress';
import FileDrop from 'react-file-drop';
import { FrameContext } from 'react-frame-component';
import { ReactComponent as Send } from '../../../../assets/send.svg';
import { ReactComponent as Emoji } from './emoji.svg';
import { ReactComponent as Attachment } from './attachment.svg';

import './style.scss';
import GlobalContext from '../../GlobalContext';

const NimblePickerLazy = React.lazy(() => import(
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  'emoji-mart/dist-es/components/picker/nimble-picker'
));

let emojiData = {};

const Loading = (
  <div className="icw-loading-ctr">
    <div className="icw-lds-ellipsis" style={{ width: 64, height: 64 }}>
      <div /><div /><div /><div />
    </div>
  </div>
);

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:41101' : 'https://infoset.app:41101';

class Sender extends PureComponent {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      inputHasFocus: false,
      showEmojiPicker: false,
      emojisLoaded: false,
      uploadingAttachment: false,
      uploadingAttachmentProgress: 0,
      inputEmpty: true,
    };
  }

  toggleEmojiPicker = () => {
    if (this.props.disabledInput) return;
    if (!this.state.emojisLoaded) {
      if (this.loadingEmojis) return;
      this.loadingEmojis = true;
      import(
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        './emojis.json'
      ).then(({ default: data }) => {
        emojiData = data;
        this.setState({ emojisLoaded: true });
        this.loadingEmojis = false;
      }).catch(err => {
        console.warn(err);
        this.loadingEmojis = false;
      });
      // load emojis for the first time
    }
    this.setState(state => ({ showEmojiPicker: !state.showEmojiPicker }));
  }

  addEmoji = obj => {
    this.toggleEmojiPicker();
    this.props.sendMessage(obj.native);
  }

  onFileUploadStart = (file, next) => {
    if (file.size / 1024 / 1024 > 10) {
      return window.alert('Max. file size: 10 MB');
    }
    this.setState({ uploadingAttachment: true, uploadingAttachmentProgress: 0 });
    if (isImage(file.name)) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function (event) {
        const blob = new File([event.target.result], file.name, { type: file.type });
        // eslint-disable-next-line no-new
        new Compressor(blob, {
          quality: 0.6,
          maxHeight: 1500,
          maxWidth: 1500,
          success: result => next(result),
          error: () => next(file),
        });
      };
    } else {
      next(file);
    }
  }

  onFileUploadProgress = percent => this.setState({ uploadingAttachmentProgress: percent });

  onFileUploadError = () => {
    this.setState({ uploadingAttachment: false, uploadingAttachmentProgress: 0 });
    this.attachmentInput.value = null;
  }

  onFileUploadEnd = result => {
    this.setState({ uploadingAttachmentProgress: 100 }, () => {
      this.setState({ uploadingAttachment: false });
      this.props.sendMessage(`${API_URL}${result.publicUrl}`, true);
    });
    this.attachmentInput.value = null;
  }

  onChange = e => {
    const inputEmpty = !e.target.value;
    this.setState({ inputEmpty });
  }

  isAcceptedFileType = type => type && (type.startsWith('image/')
    || type.startsWith('text/')
    || type.startsWith('audio/')
    || type.startsWith('video/')
    || type.startsWith('application/vnd.openxmlformats-')
    || type.startsWith('application/vnd.ms-')
    || ['application/pdf', 'application/msword'].includes(type))

  uploadFileManually = file => {
    // eslint-disable-next-line no-new
    new S3Upload({
      files: [file],
      signingUrl: '/s3/sign',
      signingUrlMethod: 'GET',
      accept: 'image/*,application/pdf,application/msword,application/vnd.ms-*,application/vnd.openxmlformats-*,text/*,audio/*,video/*',
      s3path: 'attachments/',
      preprocess: this.onFileUploadStart,
      onSignedUrl: noop,
      onProgress: this.onFileUploadProgress,
      onError: this.onFileUploadError,
      onFinishS3Put: this.onFileUploadEnd,
      uploadRequestHeaders: { 'x-amz-acl': 'public-read' },
      contentDisposition: 'auto',
      scrubFilename: filename => filename.replace(/[^\w\d_\-.]+/ig, ''),
      server: API_URL,
    });
  }

  onFileDrop = (files, e) => {
    this.preventDefault(e);
    const file = Array.from(files || [])?.find?.(file => this.isAcceptedFileType(file.type));
    if (!file) return false;
    this.uploadFileManually(file);
  }

  onPaste = e => {
    const file = Array.from(e.clipboardData?.items || []).find?.(file => file.type !== 'text/plain' && this.isAcceptedFileType(file.type));
    if (!file?.getAsFile()) return false;
    this.preventDefault(e);
    this.uploadFileManually(file.getAsFile());
  }

  preventDefault = e => e?.preventDefault();

  render() {
    const {
      sendMessage, disabledPlaceholder, disabledInput
    } = this.props;
    const {
      inputHasFocus, showEmojiPicker, emojisLoaded, uploadingAttachment, uploadingAttachmentProgress,
    } = this.state;

    return (
      <GlobalContext.Consumer>
        {({ showEmojiButton, showAttachmentButton, translation }) => {
          let inputPlaceholder = disabledInput ? disabledPlaceholder : translation.widget.senderPlaceholder;
          if (uploadingAttachment) {
            inputPlaceholder = translation.widget.uploadingFilePlaceholder;
          }
          return (
            <form
              className={cx('icw-sender', { 'input-focused': inputHasFocus })}
              onSubmit={sendMessage}
              onDrop={this.preventDefault}
              onDragOver={this.preventDefault}
            >
              <FrameContext.Consumer>
                {({ document }) => (
                  <FileDrop
                    frame={document || window.document}
                    onDrop={this.onFileDrop}
                    onFrameDrop={this.preventDefault}
                    onFrameDragEnter={this.preventDefault}
                    onFrameDragLeave={this.preventDefault}
                    onDragOver={this.preventDefault}
                  >
                  Drag file here to upload
                  </FileDrop>
                )}
              </FrameContext.Consumer>

              <input
                type="text"
                className="icw-new-message"
                name="message"
                placeholder={inputPlaceholder}
                disabled={disabledInput}
                autoFocus={!disabledInput}
                autoCorrect="off"
                autoComplete="off"
                onChange={this.onChange}
                onFocus={() => this.setState({ inputHasFocus: true })}
                onBlur={() => this.setState({ inputHasFocus: false })}
                onPaste={this.onPaste}
              />
              <div className="input-buttons">
                {showEmojiButton && (
                <span>
                  <Emoji onClick={this.toggleEmojiPicker} style={{ opacity: 0.7 }} />
                </span>
                )}
                {!uploadingAttachment && showAttachmentButton && (
                <label htmlFor="attachment-input">
                  <ReactS3Uploader
                    signingUrl="/s3/sign"
                    signingUrlMethod="GET"
                    accept="image/*,application/pdf,application/msword,application/vnd.ms-*,application/vnd.openxmlformats-*,text/*,audio/*,video/*"
                    s3path="attachments/"
                    preprocess={this.onFileUploadStart}
                    onSignedUrl={noop}
                    onProgress={this.onFileUploadProgress}
                    onError={this.onFileUploadError}
                    onFinish={this.onFileUploadEnd}
                    uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
                    contentDisposition="auto"
                    scrubFilename={filename => filename.replace(/[^\w\d_\-.]+/ig, '')}
                    server={API_URL}
                    id="attachment-input"
                    disabled={disabledInput}
                    inputRef={ref => this.attachmentInput = ref}
                    style={{ display: 'none' }}
                    ref={uploader => { this.uploader = uploader; }}
                  />
                  <Attachment />
                </label>
                )}
                {uploadingAttachment && showAttachmentButton && (
                <span>
                  <Circle percent={uploadingAttachmentProgress} strokeWidth="6" strokeColor="#212121" />
                  <span className="icw-file-upload-progress-text">{(uploadingAttachmentProgress | 0)}%</span>
                </span>
                )}
                {!this.state.inputEmpty && (
                <button type="submit" className="icw-send">
                  <Send />
                </button>
                )}
              </div>
              {showEmojiButton && (
              <div className={cx('emoji-picker', { 'is-visible': showEmojiPicker })}>
                <React.Suspense fallback={Loading}>
                  {emojisLoaded ? <NimblePickerLazy onSelect={this.addEmoji} set="apple" data={emojiData} /> : Loading}
                </React.Suspense>
              </div>
              )}
            </form>
          );
        }}
      </GlobalContext.Consumer>
    );
  }
}

Sender.propTypes = {
  sendMessage: PropTypes.func,
  disabledPlaceholder: PropTypes.string,
  disabledInput: PropTypes.bool,
};

export default Sender;
