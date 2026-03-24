import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
  FlatList,
} from "react-native";

type Props = {
  images?: string[];
};

export function FeedImageGrid({ images = [] }: Props) {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images],
  );

  const openGallery = (index: number) => {
    setSelectedIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => setShowGallery(false);

  if (!safeImages.length) return null;

  const remaining = Math.max(0, safeImages.length - 4);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  return (
    <View>
      {safeImages.length === 1 ? (
        <Pressable onPress={() => openGallery(0)}>
          <Image
            source={{ uri: safeImages[0] }}
            style={{ width: "100%", height: 220, borderRadius: 12 }}
            resizeMode="cover"
          />
        </Pressable>
      ) : safeImages.length === 2 ? (
        <View style={{ flexDirection: "row", gap: 4 }}>
          {safeImages.map((url, i) => (
            <Pressable
              key={url + i}
              style={{ flex: 1 }}
              onPress={() => openGallery(i)}
            >
              <Image
                source={{ uri: url }}
                style={{ width: "100%", height: 160, borderRadius: 8 }}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      ) : safeImages.length === 3 ? (
        <View style={{ flexDirection: "row", gap: 4 }}>
          <Pressable style={{ flex: 1 }} onPress={() => openGallery(0)}>
            <Image
              source={{ uri: safeImages[0] }}
              style={{ width: "100%", height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
          </Pressable>

          <View style={{ flex: 1, gap: 4 }}>
            {safeImages.slice(1).map((url, i) => (
              <Pressable key={url + i} onPress={() => openGallery(i + 1)}>
                <Image
                  source={{ uri: url }}
                  style={{ width: "100%", height: 98, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {safeImages.slice(0, 4).map((url, i) => (
            <Pressable
              key={url + i}
              style={{ width: "49%", position: "relative" }}
              onPress={() => openGallery(i)}
            >
              <Image
                source={{ uri: url }}
                style={{ width: "100%", height: 120, borderRadius: 8 }}
                resizeMode="cover"
              />

              {i === 3 && remaining > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
                  >
                    +{remaining}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}

      <Modal
        visible={showGallery}
        transparent
        animationType="fade"
        onRequestClose={closeGallery}
      >
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
          <View
            style={{ paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12 }}
          >
            <Pressable onPress={closeGallery} hitSlop={10}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
                Close
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={safeImages}
            horizontal
            pagingEnabled
            initialScrollIndex={Math.min(
              selectedIndex,
              Math.max(0, safeImages.length - 1),
            )}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            keyExtractor={(uri, idx) => uri + idx}
            renderItem={({ item: uri }) => (
              <View
                style={{
                  width: screenWidth,
                  height: screenHeight - 120,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri }}
                  style={{ width: screenWidth, height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
