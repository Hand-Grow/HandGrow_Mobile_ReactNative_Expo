import { createActionsheet } from "@gluestack-ui/actionsheet";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  SectionList,
  VirtualizedList,
} from "react-native";

const DummyComponent = () => null;

const Actionsheet = createActionsheet({
  Root: View,
  Backdrop: Pressable,
  Content: View,
  DragIndicator: View,
  IndicatorWrapper: View,
  Item: Pressable,
  ItemText: Text,
  Icon: View,
  ScrollView: ScrollView,
  FlatList: FlatList,
  SectionList: SectionList,
  VirtualizedList: VirtualizedList,
  SectionHeaderText: Text,
  AnimatePresence: DummyComponent,
});

export const ActionsheetBackdrop = Actionsheet.Backdrop;
export const ActionsheetContent = Actionsheet.Content;
export const ActionsheetDragIndicator = Actionsheet.DragIndicator;
export const ActionsheetDragIndicatorWrapper = Actionsheet.DragIndicatorWrapper;
export const ActionsheetItem = Actionsheet.Item;
export const ActionsheetItemText = Actionsheet.ItemText;

export { Actionsheet };
