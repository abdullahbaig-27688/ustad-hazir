import { customerNotifcations } from "@/backend/notificationService";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";

type Notification = {
    id: string;
    title: string; // translation key
    message: string; // translation key
    sendTo: string;
    createdAt: any; // Firestore timestamp
};

const NotificationScreen = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const customerNotifs = await customerNotifcations();

            // Sort by createdAt descending
            const sorted = customerNotifs.sort(
                (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            );

            setNotifications(sorted);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const time = item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleString()
            : "";

        return (
            <View style={styles.card}>
                <Ionicons name="notifications" size={22} color="#0D47A1" />
                <View style={styles.textWrapper}>
                    <Text style={styles.title}>{t(item.title)}</Text>
                    <Text style={styles.message}>{t(item.message)}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header title={t("notifications")} showBack={true} />

            {loading ? (
                <ActivityIndicator size="large" color="#0D47A1" style={{ marginTop: 20 }} />
            ) : notifications.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="notifications-off" size={60} color="#aaa" />
                    <Text style={styles.emptyText}>{t("no_notifications")}</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#F5F7FA",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "flex-start",
        gap: 12,
    },
    textWrapper: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0D47A1",
    },
    message: {
        fontSize: 14,
        color: "#333",
        marginTop: 4,
    },
    time: {
        fontSize: 12,
        color: "#777",
        marginTop: 6,
    },
    emptyBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: "#777",
    },
});
