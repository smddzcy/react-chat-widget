import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactS3Uploader from 'react-s3-uploader';
import isImage from 'is-image';
import Compressor from 'compressorjs';
import { Circle } from 'rc-progress';
import { ReactComponent as Send } from '../../../../assets/send.svg';
import { ReactComponent as Emoji } from './emoji.svg';
import { ReactComponent as Attachment } from './attachment.svg';

import './style.scss';

const NimblePickerLazy = React.lazy(() => import(
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  'emoji-mart/dist-es/components/picker/nimble-picker'
));

let emojiData = {};

const Loading = <div className="loadingCtr"><div className="icw-lds-ellipsis"><div /><div /><div /><div /></div></div>;

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
          quality: 0.7,
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

  render() {
    const {
      sendMessage, placeholder, disabledInput, showEmojiButton, showAttachmentButton,
    } = this.props;
    const {
      inputHasFocus, showEmojiPicker, emojisLoaded, uploadingAttachment, uploadingAttachmentProgress,
    } = this.state;

    return (
      <form className={cx('icw-sender', { 'input-focused': inputHasFocus })} onSubmit={sendMessage}>
        <input
          type="text"
          className="icw-new-message"
          name="message"
          placeholder={placeholder}
          disabled={disabledInput}
          autoCorrect="off"
          autoComplete="off"
          ref={ref => window.infosetChatMsgInput = ref}
          onFocus={() => this.setState({ inputHasFocus: true })}
          onBlur={() => this.setState({ inputHasFocus: false })}
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
              accept="image/*,application/pdf,text/*,audio/*,video/*"
              s3path="attachments/"
              preprocess={this.onFileUploadStart}
              onSignedUrl={() => {}}
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
              autoUpload
            />
            <Attachment />
          </label>
          )}
          {uploadingAttachment && showAttachmentButton && (
            <span>
              <Circle percent={uploadingAttachmentProgress} strokeWidth="6" strokeColor="#212121" />
            </span>
          )}
          <button type="submit" className="icw-send">
            <Send />
          </button>
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
  }
}

Sender.propTypes = {
  sendMessage: PropTypes.func,
  placeholder: PropTypes.string,
  disabledInput: PropTypes.bool,
  showEmojiButton: PropTypes.bool,
  showAttachmentButton: PropTypes.bool,
};

export default Sender;
