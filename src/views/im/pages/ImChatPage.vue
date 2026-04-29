<template>
  <div
    class="im-chat-page"
    :class="{
      'van-safe-area-bottom': !inputActive,
    }"
  >
    <div class="chat-record-section" ref="chatRecordRef" id="test" @click="toggleState(false)">
      <div class="history-loading" v-if="loading || isEnd">
        <van-loading v-if="loading && !isEnd" size="0.5rem" />
        <span v-if="isEnd">{{ $t('im.record-end') }}</span>
      </div>
      <template v-for="(msgItem, index) of chatRecord" :key="msgItem.clientMsgID">
        <template
          v-if="
            !isShowTimeline(
              msgItem.sendTime,
              index > 0
                ? chatRecord[index - 1].sendTime
                : dayjs(msgItem.sendTime).subtract(1, 'day').valueOf(),
            )
          "
        >
          <div class="timeline">{{ dayjs(msgItem.sendTime).format('YYYY/MM/DD HH:mm') }}</div>
          <ImFaqCard
            v-if="
              isShowFaqCard(
                msgItem.sendTime,
                index > 0
                  ? chatRecord[index - 1].sendTime
                  : dayjs(msgItem.sendTime).subtract(1, 'day').valueOf(),
              )
            "
          />
        </template>
        <div
          class="chat-record-cell"
          :class="{
            'msg-sender': msgItem.sendID === imService.imLoginInfo?.userId,
          }"
        >
          <div class="chat-record-wrapper" v-if="msgItem.contentType === MessageType.TextMessage">
            <span
              class="msg-read"
              :class="{
                unread: !msgItem.isRead,
              }"
              v-if="msgItem.sendID === imService.imLoginInfo?.userId"
              >{{ msgItem.isRead ? $t('im.msg-read') : $t('im.msg-unread') }}</span
            >
            <div class="chat-record">
              <div class="chat-record__content">{{ msgItem.textElem?.content ?? ' ' }}</div>
            </div>
          </div>

          <div
            class="chat-resouce-record"
            v-else-if="msgItem.contentType === MessageType.PictureMessage"
          >
            <span
              class="msg-read"
              :class="{
                unread: !msgItem.isRead,
              }"
              v-if="msgItem.sendID === imService.imLoginInfo?.userId"
              >{{ msgItem.isRead ? $t('im.msg-read') : $t('im.msg-unread') }}</span
            >
            <van-image
              radius="0.1067rem"
              height="2.1333rem"
              lazy-load
              fit="contain"
              :src="msgItem.pictureElem?.snapshotPicture.url"
              @click="handlePicPreview(msgItem.clientMsgID)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="0.4267rem" />
              </template>
            </van-image>
          </div>
          <div
            class="chat-resouce-record"
            v-else-if="msgItem.contentType === MessageType.VideoMessage"
          >
            <span
              class="msg-read"
              :class="{
                unread: !msgItem.isRead,
              }"
              v-if="msgItem.sendID === imService.imLoginInfo?.userId"
              >{{ msgItem.isRead ? $t('im.msg-read') : $t('im.msg-unread') }}</span
            >
            <div
              class="video-pic-msg"
              @click="handleShowVideoPreview(msgItem.videoElem?.videoUrl ?? '')"
            >
              <img :src="msgItem.videoElem?.snapshotUrl" @error="onImageError" alt="" />
              <div class="video-time">{{ formatDuraton(msgItem.videoElem?.duration ?? 0) }}</div>
              <van-icon
                class="video-pic-msg__icon"
                color="#fff"
                name="play-circle-o"
                size="0.7467rem"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="send-msg-section">
      <div
        class="header-section"
        :class="{
          'divider-border-noconvert': expandState,
        }"
      >
        <img
          class="more-icon clickable-item"
          src="/src/assets/images/icon-plus.png"
          alt=""
          @click="() => toggleState()"
        />
        <!-- <div class="input-area"></div> -->
        <van-field
          v-model="inputValue"
          name="chatRecord"
          class="input-area"
          :placeholder="$t('im.input-tip')"
          :border="false"
          autocomplete="off"
          clearable
          @keypress.enter="handleSend"
          @focus="handleInputFocus"
          @blur="() => (inputActive = false)"
        />
        <div class="send-btn clickable-item" @click="handleSend">{{ $t('im.send') }}</div>
      </div>
      <div
        class="collapse-section"
        :class="{
          expand: expandState,
        }"
      >
        <div class="grid-item-cell">
          <div class="grid-item clickable-item">
            <van-uploader
              accept="image/*,video/*"
              :before-read="beforeRead"
              :after-read="afterRead"
              :max-size="maxFileSize"
              @oversize="onOversize"
            >
              <img src="/src/assets/images/im/icon-album.png" alt="" class="grid-item__pic" />
            </van-uploader>
            <div class="grid-item__label">{{ $t('im.album') }}</div>
          </div>
          <div class="grid-item clickable-item">
            <van-uploader
              capture="camera"
              accept="image/*,video/*"
              :before-read="beforeRead"
              :after-read="afterRead"
              :max-size="maxFileSize"
              @oversize="onOversize"
              @click-upload="handleCheckPermission"
            >
              <img src="/src/assets/images/im/icon-photo.png" alt="" class="grid-item__pic" />
            </van-uploader>
            <div class="grid-item__label">{{ $t('im.photo') }}</div>
          </div>
        </div>
      </div>
    </div>
    <van-overlay :show="showVideoPlayer" @click="showVideoPlayer = false">
      <video-player-dialog :video-url="currentVideo" v-if="showVideoPlayer" />
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
  import {
    CbEvents,
    type MessageItem,
    MessageType,
    type ReceiptInfo,
    type WSEvent,
  } from '@openim/wasm-client-sdk';
  import { useToggle } from '@vant/use';
  import {
    closeToast,
    showDialog,
    showImagePreview,
    showLoadingToast,
    showToast,
    type UploaderFileListItem,
  } from 'vant';
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import dayjs from 'dayjs';
  import useLoading from '@/hooks/loading';
  import { debounce } from 'lodash-es';
  import { delayFunction } from '@/utils/delay';
  import { useFileMessage } from '@/hooks/im/useFileMessage';
  import VideoPlayerDialog from '../components/VideoPlayerDialog.vue';
  import { formatDuraton } from '@/utils/formatter';
  import { useI18n } from 'vue-i18n';
  import Compressor from 'compressorjs';
  import { checkDevicePermission } from '@/utils/device-permission';
  import { isAndroid, isIOS } from '@/utils/env';
  import { useOpemImChatPage, useSendDeviceInfo } from '../common';
  import ImFaqCard from '../components/ImFaqCard.vue';
  import { IMSDK } from '@/utils/open-im';
  import { useImService } from '@/stores';

  const { t } = useI18n();

  const imService = useImService();

  const { createImageOrVideoMessage } = useFileMessage();
  const { createDeviceInfoTemplate } = useOpemImChatPage();
  const { hasSendDeviceInfo, updateSendDeviceInfo } = useSendDeviceInfo();

  const chatRecordRef = ref<HTMLDivElement>();
  const chatRecord = ref<MessageItem[]>([]);
  const { loading, setLoading } = useLoading();
  const isEnd = ref(false);
  const chatRecordRequest = reactive<OpenImChatRecordRequest>({
    lastMinSeq: 0,
    count: 20,
    startClientMsgID: '',
    conversationID: '',
  });

  const showVideoPlayer = ref(false);
  const currentVideo = ref('');

  // 客服信息
  const conversationInfo = computed(() => imService.customerConversation!);

  const inputValue = ref<string>('');

  const [expandState, toggleState] = useToggle();

  // let toast: ToastWrapperInstance | null = null;
  const inputActive = ref<boolean>(false);

  // 登录im客户端
  async function initChatService() {
    await getHistoryChatRecord();
    sendDeviceInfoMsgWhenInitSuccess();
  }
  initChatService();

  async function getHistoryChatRecord() {
    chatRecordRequest.conversationID = imService.customerConversation?.conversationID ?? '';
    clearNoReadMsg();
    try {
      const { data } = await IMSDK.getAdvancedHistoryMessageList(chatRecordRequest);

      // 过滤出图片、视频和文本消息
      const filterData = data.messageList.filter((e) =>
        [MessageType.TextMessage, MessageType.PictureMessage, MessageType.VideoMessage].includes(
          e.contentType,
        ),
      );

      chatRecord.value = [...filterData, ...chatRecord.value];
      // 回填请求信息
      chatRecordRequest.lastMinSeq = data.lastMinSeq;
      if (data.messageList.length) {
        chatRecordRequest.startClientMsgID = data.messageList[0].clientMsgID;
      }

      isEnd.value = data.isEnd;

      console.log('getAdvancedHistoryMessageList: ', data, chatRecord.value.length);
    } catch (error) {
      console.log('getHistoryMsg fail: ', error);
    } finally {
      setLoading(false);
    }
  }

  // 发送消息
  async function handleSend() {
    if (inputValue.value === '') {
      return;
    }
    const message = await IMSDK.createTextMessage(inputValue.value);
    inputValue.value = '';

    imService
      .sendImMsg(message.data)
      .then((res) => {
        chatRecord.value.push(res.data);
        scrollToBottomWhenReceiveMsg('smooth');
      })
      .catch((e) => {
        console.log('sendMessage fail : ', e);
        showToast(t('im.send-fail'));
      });
  }

  // 清除未读消息
  function clearNoReadMsg() {
    if (
      chatRecord.value
        .filter((e) => e.sendID !== imService.imLoginInfo?.userId)
        .some((e) => !e.isRead)
    ) {
      IMSDK.markConversationMessageAsRead(conversationInfo.value.conversationID);
    }
  }

  /**
   * 比较是否同一天
   * @param time1 毫秒数，时间戳
   * @param time2 毫秒数，时间戳
   */
  function isShowFaqCard(time1: number, time2: number) {
    return (
      !dayjs(time1).isSame(dayjs(time2), 'dates') && dayjs(time1).isSame(dayjs(new Date()), 'dates')
    );
  }

  /**
   * 判断是否处于一个时间间隔内，15minutes
   * @param preTimeStamp  毫秒数，时间戳
   * @param nextTimeStamp 毫秒数，时间戳
   */
  function isShowTimeline(preTimeStamp: number, nextTimeStamp: number) {
    return Math.abs(nextTimeStamp - preTimeStamp) < 15 * 60 * 1000;
  }

  /**
   * 监听消息
   */
  IMSDK.on(CbEvents.OnRecvNewMessages, async (res) => {
    const msgs = res.data;
    console.log('mitter onRecvNewMessages: ', msgs);
    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      if (
        [MessageType.TextMessage, MessageType.PictureMessage, MessageType.VideoMessage].includes(
          msg.contentType,
        ) &&
        msg.sendID === imService.imLoginInfo?.customerUserId
      ) {
        const checkMsg = chatRecord.value.some((e) => e.clientMsgID === msg.clientMsgID);
        if (!checkMsg) {
          clearNoReadMsg();
          msg.isRead = true;
          chatRecord.value.push(msg);
        }
      }
    }
    if (isScrollAtBottom(100)) {
      scrollToBottomWhenReceiveMsg('smooth');
    }
  });

  IMSDK.on(CbEvents.OnRecvC2CReadReceipt, (data: WSEvent<ReceiptInfo[]>) => {
    console.log('OnRecvC2CReadReceipt: ', data);
    if (data.errCode === 0) {
      const receiptInfos = data.data;
      for (let i = 0; i < receiptInfos.length; i++) {
        const receiptInfo = receiptInfos[i];
        const readMsgIds = receiptInfo.msgIDList;
        chatRecord.value.forEach((e) => {
          if (readMsgIds.includes(e.clientMsgID)) {
            e.isRead = true;
          }
        });
      }
    }
  });

  /**
   * 监听器，更新消息列表
   */
  watch(
    () => chatRecord.value,
    async (_, oldQuestion) => {
      if (!oldQuestion.length) {
        await nextTick();
        chatRecordRef.value!.scrollTo({
          behavior: 'auto',
          top: chatRecordRef.value!.scrollHeight,
        });
        return;
      }
    },
    // {
    //   flush: 'post',
    // },
  );

  async function scrollToBottomWhenReceiveMsg(behavior: ScrollBehavior = 'auto') {
    await nextTick();
    chatRecordRef.value!.scrollTo({
      behavior: behavior,
      top: chatRecordRef.value!.scrollHeight,
    });
    return;
  }

  function isScrollAtBottom(offset: number = 0) {
    return (
      chatRecordRef.value!.scrollHeight - chatRecordRef.value!.scrollTop <=
      chatRecordRef.value!.clientHeight + offset
    );
  }

  /**
   * 消息区域上拉加载事件监听
   */
  const chatRefScrollEvent = debounce(async (e: Event) => {
    console.log('chatRefSrcollEvent emit');
    const target = e.target as HTMLDivElement;
    // 多加50px，触发加载
    if (target.scrollTop < 50 && !loading.value && !isEnd.value) {
      setLoading(true);
      const oldScrollPosition = chatRecordRef.value!.scrollHeight - chatRecordRef.value!.scrollTop;
      await delayFunction(500);
      await getHistoryChatRecord();
      nextTick(() => {
        chatRecordRef.value!.scrollTop = chatRecordRef.value!.scrollHeight - oldScrollPosition;
      });
    }
  }, 500);

  onMounted(() => {
    // 监听消息区域滚动事件
    chatRecordRef.value?.addEventListener('scroll', chatRefScrollEvent);
  });

  onBeforeUnmount(() => {
    chatRecordRef.value?.removeEventListener('scroll', chatRefScrollEvent);
  });

  /**
   * 图片消息
   */
  const afterRead = async (fileItem: UploaderFileListItem) => {
    console.log(fileItem);
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: t('im.sending'),
    });
    // 生成图片消息
    const fileMsg = await createImageOrVideoMessage(fileItem.file!);
    imService
      .sendImMsg(fileMsg)
      .then((res) => {
        closeToast();
        chatRecord.value.push(res.data);
        scrollToBottomWhenReceiveMsg('smooth');
      })
      .catch((e) => {
        closeToast();
        console.log('sendMessage fail : ', e);
        showToast(t('im.send-fail'));
      });
  };

  const beforeRead = (file: File) => {
    if (/image.*/.test(file.type)) {
      return new Promise((resolve, reject) => {
        if (/image.*/.test(file.type)) {
          return new Compressor(file, {
            success: resolve,
            // compressorjs 默认开启 checkOrientation 选项, 会将图片修正为正确方向
            checkOrientation: true,
            quality: 0.8,
            error(err) {
              console.log('compress image fail: ', err.message);
              reject();
            },
          });
        }
      });
    } else {
      // 视频文件直接上传
      return true;
    }
  };

  function handlePicPreview(msgId: string) {
    // 获取所有图片消息
    const picMsgList = chatRecord.value.filter((e) => e.contentType === MessageType.PictureMessage);
    const index = picMsgList.findIndex((e) => e.clientMsgID === msgId);
    showImagePreview({
      images: picMsgList.map((e) => e.pictureElem!.sourcePicture.url),
      startPosition: index === -1 ? 1 : index,
      showIndicators: true,
      closeable: true,
    });
  }

  function handleShowVideoPreview(videoUrl: string) {
    currentVideo.value = videoUrl;
    showVideoPlayer.value = true;
  }

  // 拍摄上传前置校验摄像头和麦克风权限
  function handleCheckPermission(_e: MouseEvent) {
    console.log('check permission...');
    if (isIOS()) {
      checkDevicePermission({ video: true, audio: true })
        .then((stream) => {
          console.log(stream);
        })
        .catch((err) => {
          console.log('permisson denied: ', err);
          // showToast(t('im.video-permission-tip'));
          if (err) {
            showDialog({
              title: t('im.no-permission-title'),
              message: t('im.video-permission-tip'),
            });
          }
        });
    }
  }

  // 兼容输入框
  function handleInputFocus(e: Event) {
    inputActive.value = true;
    if (isAndroid()) {
      setTimeout(() => {
        console.log('scroll');
        (e?.target as HTMLDivElement)?.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }, 400);
    }
  }

  // 处理图片加载失败
  function onImageError(e: Event) {
    console.log('onImageError: ', e);
    const imgTargetElement = e.target as HTMLImageElement;
    imgTargetElement.hidden = true;
    imgTargetElement.style.display = 'none';
    imgTargetElement.style.opacity = '0';
    imgTargetElement.style.visibility = 'hidden';
  }

  // im登录成功后，发送设备信息。
  async function sendDeviceInfoMsgWhenInitSuccess() {
    // 查找指定设备信息
    const deviceInfo = imService.selectDevice;
    if (deviceInfo) {
      // 判断当前是否已经发送消息
      if (hasSendDeviceInfo(deviceInfo.sn)) return;

      const deviceInfoMsg = await IMSDK.createTextMessage(createDeviceInfoTemplate(deviceInfo));
      imService
        .sendImMsg(deviceInfoMsg.data)
        .then((res) => {
          chatRecord.value.push(res.data);
          updateSendDeviceInfo(deviceInfo.sn);
          scrollToBottomWhenReceiveMsg('smooth');
        })
        .catch((e) => {
          console.log('sendMessage template msg fail : ', e);
        });
    }
  }

  const maxFileSize = 100 * 1024 * 1024;
  const onOversize = (_file: File) => {
    showToast(t('im.max-filesize-toast', ['100M']));
  };

  onBeforeUnmount(() => {
    closeToast();
  });
</script>

<style scoped lang="less">
  .im-chat-page {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .chat-record-section {
      flex: 1;
      overflow: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      padding-top: 20px;
      background-color: #f9f9f9;

      .history-loading {
        margin: 8px 0;
        text-align: center;
        font-size: var(--van-font-size-xs);
        color: #999;
        min-height: 0.5rem;
      }

      .timeline {
        text-align: center;
        font-weight: 400;
        font-size: 9px;
        color: #757575;
        font-style: normal;
        text-transform: none;
        margin-bottom: 10px;
      }

      .chat-record-cell {
        display: flex;

        .chat-resouce-record {
          margin: 0 51px 19px 26px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
          // background-color: #fff;

          ::v-deep(.van-image img) {
            width: auto;
          }

          .video-pic-msg {
            position: relative;
            height: 80px;
            width: 120px;
            background-color: #000;
            border-radius: 4px;
            overflow: hidden;
            > img {
              height: 80px;
              width: 120px;
              object-fit: cover;
            }

            .video-pic-msg__icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }

          .video-time {
            position: absolute;
            right: 4px;
            bottom: 4px;
            font-size: 10px;
            color: #fff;
          }
        }

        .chat-record {
          width: fit-content;
          padding: 16px 20px;
          background-color: #fff;
          border-radius: 10px 10px 10px 0;
          color: #232323;
          word-break: break-all;

          .chat-record__content {
            font-weight: 400;
            font-size: 13px;
            line-height: 16px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            // padding: 0 9px;
            word-break: break-all;
            white-space: pre-wrap;
            // min-height: 16px;
            // min-width: 32px;
            // word-break: break-word;
          }

          .msg-time {
            font-size: 9px;
            text-align: right;
          }
        }

        .chat-record-wrapper {
          display: flex;
          align-items: flex-end;
          margin: 0 51px 19px 26px;
        }

        &.msg-sender {
          justify-content: flex-end;

          .chat-record-wrapper {
            margin: 0 26px 19px 51px;
          }

          .chat-record {
            background-color: #bbdeff;
            border-radius: 10px 10px 0px 10px;
          }

          .chat-resouce-record {
            margin: 0 26px 19px 51px;
          }
        }

        .msg-read {
          margin: 0 8px;
          font-size: 10px;
          color: #9c9c9c;
          flex-shrink: 0;
          text-wrap: nowrap;

          &.unread {
            color: #247cff;
          }
        }
      }
    }

    .send-msg-section {
      display: flex;
      flex-direction: column;
      .header-section {
        flex-shrink: 0;
        min-height: 58px;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 10px 13px;

        .more-icon {
          height: 26px;
          width: 26px;
          display: block;
          object-fit: contain;
        }

        .input-area {
          flex: 1;
          height: 32px;
          font-size: 13px;
          background-color: #f9f9f9;
          border-radius: 5px;
          padding-top: 0;
          padding-bottom: 0;
          display: flex;
          align-items: center;
        }

        .send-btn {
          height: 32px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #247cff;
          transition: 0.36s opacity;
          border-radius: 5px;
          font-weight: 400;
          font-size: 13px;
          color: #ffffff;
          font-style: normal;
          text-transform: none;
          flex-shrink: 0;
        }

        & > *:not(& > *:last-child) {
          margin-right: 6px;
        }

        &.divider-border-noconvert {
          border-bottom: 1px solid rgba(35, 35, 35, 0.1);
        }
      }

      .collapse-section {
        display: grid;
        grid-template-rows: 0fr;
        transition: 250ms all ease-out;
        overflow: hidden;
        opacity: 0;

        .grid-item-cell {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding: 0 26px;
          overflow: hidden;

          .grid-item {
            flex: 0 0 20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            // min-height: 96px;
            margin-bottom: 19px;

            .grid-item__pic {
              height: 38px;
              width: 38px;
              display: block;
              background-color: #f9f9f9;
              border-radius: 6px;
              margin-bottom: 4px;
              border: 1px dashed #8f8f8f;
            }

            .grid-item__label {
              font-weight: 400;
              font-size: 12px;
              color: #8f8f8f;
              line-height: 14px;
              text-align: center;
              font-style: normal;
              text-transform: none;
            }
          }
        }

        &.expand {
          grid-template-rows: 1fr;
          opacity: 1;

          .grid-item-cell {
            margin-top: 19px;
          }
        }
      }
    }
  }

  .clickable-item {
    cursor: pointer;
    transition: 250ms opacity;
    &:active {
      opacity: 0.8;
    }
  }

  ::v-deep(.van-image__loading) {
    background-color: transparent;
  }

  ::v-deep(.van-image__error) {
    background-color: #fff;
  }
</style>
