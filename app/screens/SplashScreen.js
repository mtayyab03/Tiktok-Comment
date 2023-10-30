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
  Modal,
} from "react-native";
import Colors from "../config/Colors";
import EmojiPicker from "../components/EmojiPicker";
import { RFPercentage } from "react-native-responsive-fontsize";
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";

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
  const [fourthmodalVisible, setFourthModalVisible] = useState(false);
  const [commentStates, setCommentStates] = useState({});
  const toggleLike = (commentId) => {
    // Create a new state object based on the previous state
    setCommentStates((prevStates) => ({
      ...prevStates,
      [commentId]: {
        ...prevStates[commentId],
        isLiked: !prevStates[commentId]?.isLiked,
        isDisliked: false, // Reset dislike when liking
      },
    }));
  };

  const toggleDislike = (commentId) => {
    // Create a new state object based on the previous state
    setCommentStates((prevStates) => ({
      ...prevStates,
      [commentId]: {
        ...prevStates[commentId],
        isDisliked: !prevStates[commentId]?.isDisliked,
        isLiked: false, // Reset like when disliking
      },
    }));
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
    setReplyText(""); // Pre-fill the input with the username
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

  const CommentReplies = ({
    onpress,
    commentId,
    replies,
    toggleLike,
    toggleDislike,
    isLiked,
    isDisliked,
  }) => {
    return replies.map((reply) => (
      <View key={reply._id}>
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
              <TouchableOpacity onPress={onpress}>
                <Text
                  style={{
                    marginLeft: RFPercentage(2),
                    fontSize: RFPercentage(1.7),
                    fontWeight: "400",
                  }}
                >
                  reply
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
          </View>
        </View>
      </View>
    ));
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
        onPress={() => setFourthModalVisible(true)}
      >
        <Text style={{ color: Colors.blacky }}>View Comments</Text>
      </TouchableOpacity>

      <Modal
        style={{ marginBottom: RFPercentage(10) }}
        animationType="slide"
        transparent={true}
        visible={fourthmodalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setFourthModalVisible(!fourthmodalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }}></View>
          <View
            style={{
              width: "93%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: RFPercentage(2),
            }}
          >
            <Text style={{ fontSize: RFPercentage(1.7) }}>23 comments</Text>
            <TouchableOpacity
              onPress={() => setFourthModalVisible(!fourthmodalVisible)}
              activeOpacity={0.7}
              style={{ position: "absolute", right: 0 }}
            >
              <AntDesign name={"close"} size={25} color={"black"} />
            </TouchableOpacity>
          </View>
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
                        style={{ marginRight: RFPercentage(3) }}
                        onPress={() => toggleLike(item._id)}
                      >
                        <Icon
                          name={
                            commentStates[item._id]?.isLiked
                              ? "heart"
                              : "heart-o"
                          }
                          size={15}
                          color={
                            commentStates[item._id]?.isLiked ? "red" : "black"
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => toggleDislike(item._id)}>
                        <Icon
                          name={
                            commentStates[item._id]?.isDisliked
                              ? "thumbs-down"
                              : "thumbs-o-down"
                          }
                          size={17}
                          color={
                            commentStates[item._id]?.isDisliked
                              ? Colors.blue
                              : "black"
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <CommentReplies
                    commentId={item._id}
                    replies={replies[item._id] || []}
                    toggleLike={() => toggleLike(item._id)}
                    toggleDislike={() => toggleDislike(item._id)}
                    isLiked={commentStates[item._id]?.isLiked}
                    isDisliked={commentStates[item._id]?.isDisliked}
                    onpress={() => replyToComment(item._id)}
                  />
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
