import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, Text, Pressable, TextInput, SafeAreaView, Modal, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Stats from '../../components/stats';
import { dataPool } from '@/assets/datapool'; // Import your data source

export default function EntriesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [customRangePickerModelVisible, setCRMVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('This week');
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const dp = dataPool();
  const [selectedEntry, setSelectedEntry] = useState(dp[dp.length - 1]);

  const show = () => setModalVisible(true);
  const hide = () => setModalVisible(false);
  const openCRModel = () => setCRMVisible(true);
  const closeCRModel = () => setCRMVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataPool();
      setChartData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (search) {
      const searchTerms = search.toLowerCase().split(' ');
      const filtered = chartData.filter(item => {
        const startDate = item.startDate.toLowerCase();
        const endDate = item.endDate.toLowerCase();
        const totalHours = item.totalHours.toString();

        return searchTerms.every(term =>
          startDate.includes(term) ||
          endDate.includes(term) ||
          totalHours.includes(term)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(chartData);
    }
  }, [search, chartData]);

  function changeTextHandler(text) {
    setSearch(text);
  }

  function handleOptionSelect(option) {
    setSelectedOption(option);
    hide();
  }

  function handleRowPress(item) {
    setSelectedEntry(item);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{selectedEntry.startDate.replaceAll("-", " ")} - {selectedEntry.endDate.replaceAll("-", " ")}</Text>
      <Stats devices={selectedEntry.devices} />
      <View style={styles.separator}></View>
      <Text style={styles.header}>Screen time per week</Text>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchField}
          placeholder="Search"
          placeholderTextColor="#aaa"
          onChangeText={changeTextHandler}
          inputMode='search'
        />
        <Pressable
          onPress={() => {
            if (search) {
              Alert.alert("Search query", `The searched query was: ${search}`);
            }
          }}>
          <FontAwesome name="search" size={24} color="#fff" />
        </Pressable>
      </View>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableTitle}>Day range</Text>
        <Text style={styles.tableTitle}>Total screen time</Text>
      </View>
      <ScrollView style={styles.table}>
        {filteredData.length > 0 ? (
          <View>
            {filteredData.map((item, index) => (
              <Pressable key={index} style={styles.tableRow} onPress={() => handleRowPress(item)}>
                <Text style={styles.tableText}>{item.startDate.replaceAll("-", " ")} - {item.endDate.replaceAll("-", " ")}</Text>
                <Text style={styles.tableText}>{item.totalHours} h</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.tableText}>No data available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
    padding: 20,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#434343',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchField: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dropdownContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#434343',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
  },
  header: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#434343',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    backgroundColor: '#434343',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#555',
    borderBottomWidth: 1,
  },
  tableText: {
    color: '#fff',
    fontSize: 15,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 20,
    alignSelf: 'center',
  },
});
