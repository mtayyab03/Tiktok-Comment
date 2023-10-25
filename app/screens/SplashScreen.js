import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../config/Colors";
import EmojiPicker from "../components/EmojiPicker";
import { RFPercentage } from "react-native-responsive-fontsize";
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/FontAwesome";

const CommentSection = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyText, setReplyText] = useState(""); // New state variable for reply text
  const inputRef = useRef(null);
  const [isDisliked, setIsDisliked] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replies, setReplies] = useState({});

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) {
      setIsDisliked(false);
    }
  };

  const toggleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) {
      setIsLiked(false);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const hideEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    setReplyText((prevText) => prevText + emoji);
  };

  const replyToComment = (commentId) => {
    setReplyToCommentId(commentId);
    // Focus on the input field to allow the user to start typing the reply
    inputRef.current.focus();
    setReplyText(`@${commentId} `); // Pre-fill the input with the username
  };

  const sendMessage = () => {
    if (replyText.trim() === "") {
      return;
    }

    const newMessage = {
      _id: messages.length + 1,
      text: replyText,
      user: { _id: 1 },
      parentCommentId: replyToCommentId,
    };

    if (replyToCommentId) {
      setReplies((prevReplies) => ({
        ...prevReplies,
        [replyToCommentId]: [
          ...(prevReplies[replyToCommentId] || []),
          newMessage,
        ],
      }));
    } else {
      // Add new message to the list of messages
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    setReplyText(""); // Clear the reply text
    setReplyToCommentId(null);
    hideEmojiPicker();
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          width: "90%",
          marginTop: RFPercentage(15),
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={toggleModal}
      >
        <Text style={{ color: Colors.blacky }}>View Comments</Text>
      </TouchableOpacity>

      <Modal
        style={{ marginBottom: RFPercentage(10) }}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <View style={{ flex: 1, backgroundColor: "lightgrey" }}></View>

          <FlatList
            style={{ width: "100%" }}
            data={messages}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  paddingTop: RFPercentage(3),
                }}
              >
                <View
                  style={{
                    width: "10%",
                    backgroundColor: Colors.blacky,
                    width: RFPercentage(5),
                    height: RFPercentage(5),
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: RFPercentage(5),
                    overflow: "hidden",
                  }}
                >
                  <Image
                    style={{
                      width: RFPercentage(5),
                      height: RFPercentage(5),
                    }}
                    source={require("../../assets/images/person2.png")}
                  />
                </View>
                <View style={{ width: "90%", marginLeft: RFPercentage(1.5) }}>
                  <Text
                    style={{
                      fontSize: RFPercentage(1.6),
                      fontWeight: "bold",
                      color: Colors.darkgrey,
                    }}
                  >
                    Gojo Satoro
                  </Text>
                  <Text
                    style={{
                      fontSize: RFPercentage(2),
                      fontWeight: "500",
                      marginTop: RFPercentage(0.5),
                    }}
                  >
                    {item.text}
                  </Text>
                  <View
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      marginTop: RFPercentage(0.5),
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFPercentage(1.5),
                        fontWeight: "300",
                        color: Colors.darkgrey,
                      }}
                    >
                      57 min
                    </Text>
                    <TouchableOpacity onPress={() => replyToComment(item._id)}>
                      <Text
                        style={{
                          marginLeft: RFPercentage(2),
                          fontSize: RFPercentage(1.7),
                          fontWeight: "400",
                          color: Colors.blue,
                        }}
                      >
                        Reply
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        onPress={toggleLike}
                        style={{ marginRight: RFPercentage(3) }}
                      >
                        <Icon
                          name={isLiked ? "heart" : "heart-o"}
                          size={15}
                          color={isLiked ? "red" : "black"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={toggleDislike}>
                        <Icon
                          name={isDisliked ? "thumbs-down" : "thumbs-o-down"}
                          size={17}
                          color={isDisliked ? Colors.blue : "black"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {Object.keys(replies).map((parentCommentId) => (
                    <View key={parentCommentId}>
                      {replies[parentCommentId].map((reply) => (
                        <View
                          key={reply._id}
                          style={{
                            width: "100%",
                            padding: 10,
                            flexDirection: "row",
                            paddingTop: RFPercentage(3),
                          }}
                        >
                          <View
                            style={{
                              width: "10%",
                              backgroundColor: Colors.blacky,
                              width: RFPercentage(5),
                              height: RFPercentage(5),
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: RFPercentage(5),
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              style={{
                                width: RFPercentage(5),
                                height: RFPercentage(5),
                              }}
                              source={require("../../assets/images/person2.png")}
                            />
                          </View>
                          <View
                            style={{
                              width: "90%",
                              marginLeft: RFPercentage(1.5),
                            }}
                          >
                            <Text
                              style={{
                                fontSize: RFPercentage(1.6),
                                fontWeight: "bold",
                                color: Colors.darkgrey,
                              }}
                            >
                              Gojo Satoro
                            </Text>
                            <Text
                              style={{
                                fontSize: RFPercentage(2),
                                fontWeight: "500",
                                marginTop: RFPercentage(0.5),
                              }}
                            >
                              {reply.text} {/* Use reply text */}
                            </Text>
                            <View
                              style={{
                                width: "90%",
                                flexDirection: "row",
                                marginTop: RFPercentage(0.5),
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: RFPercentage(1.5),
                                  fontWeight: "300",
                                  color: Colors.darkgrey,
                                }}
                              >
                                57 min
                              </Text>
                              <Text
                                style={{
                                  marginLeft: RFPercentage(2),
                                  fontSize: RFPercentage(1.7),
                                  fontWeight: "400",
                                }}
                              >
                                reply
                              </Text>
                              <View
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  flexDirection: "row",
                                }}
                              >
                                <TouchableOpacity
                                  onPress={toggleLike}
                                  style={{ marginRight: RFPercentage(3) }}
                                >
                                  <Icon
                                    name={isLiked ? "heart" : "heart-o"}
                                    size={15}
                                    color={isLiked ? "red" : "black"}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleDislike}>
                                  <Icon
                                    name={
                                      isDisliked
                                        ? "thumbs-down"
                                        : "thumbs-o-down"
                                    }
                                    size={17}
                                    color={isDisliked ? Colors.blue : "black"}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            )}
          />

          {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: RFPercentage(2),
                marginBottom: RFPercentage(3),
              }}
            >
              <View
                style={{
                  width: "10%",
                  backgroundColor: Colors.blacky,
                  width: RFPercentage(5),
                  height: RFPercentage(5),
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: RFPercentage(5),
                  overflow: "hidden",
                }}
              >
                <Image
                  style={{ width: RFPercentage(5), height: RFPercentage(5) }}
                  source={require("../../assets/images/person2.png")}
                />
              </View>

              <View
                style={{
                  width: "88%",
                  backgroundColor: "#f2f2f2",
                  borderRadius: 25,
                  padding: 15,
                  margin: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextInput
                  ref={inputRef}
                  placeholder={
                    replyToCommentId ? "Replying..." : "Add a comment..."
                  }
                  value={replyText}
                  onChangeText={(text) => setReplyText(text)}
                  onFocus={hideEmojiPicker}
                />

                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    right: RFPercentage(2),
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={sendMessage}
                    style={{
                      alignItems: "center",
                      margin: 5,
                    }}
                  >
                    <Entypo name={"email"} size={20} color={Colors.darkgrey} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleEmojiPicker}
                    style={{
                      alignItems: "center",
                      margin: 5,
                    }}
                  >
                    <Text style={{ fontSize: RFPercentage(2.5) }}>😀</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default CommentSection;
