import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { daoProposals } from '../api/mockData';

export default function DAOScreen() {
  const [votedProposals, setVotedProposals] = useState({});

  const handleVote = (id, type) => {
    setVotedProposals(prev => ({ ...prev, [id]: type }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community DAO</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#64b5f6" />
          <Text style={styles.infoText}>
            Holders of the ChainBite Token can vote on platform features, fee structures, and featured vendors.
          </Text>
        </View>

        {daoProposals.map(proposal => {
          const hasVoted = votedProposals[proposal.id];
          const totalVotes = proposal.yesVotes + proposal.noVotes;
          const yesPercent = Math.round((proposal.yesVotes / totalVotes) * 100);
          
          return (
            <GlassCard key={proposal.id} style={styles.proposalCard}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active Proposal</Text>
              </View>
              
              <Text style={styles.proposalTitle}>{proposal.title}</Text>
              <Text style={styles.proposalDesc}>{proposal.description}</Text>
              
              {!hasVoted ? (
                <View style={styles.voteControls}>
                  <TouchableOpacity style={styles.voteBtnYes} onPress={() => handleVote(proposal.id, 'yes')}>
                    <Text style={styles.voteBtnText}>Vote Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.voteBtnNo} onPress={() => handleVote(proposal.id, 'no')}>
                    <Text style={styles.voteBtnText}>Vote No</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.resultsContainer}>
                  <Text style={styles.votedText}>You voted {hasVoted.toUpperCase()}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${yesPercent}%` }]} />
                  </View>
                  <View style={styles.resultLabels}>
                    <Text style={styles.resultYes}>{yesPercent}% Yes</Text>
                    <Text style={styles.resultNo}>{100 - yesPercent}% No</Text>
                  </View>
                </View>
              )}
            </GlassCard>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(100, 181, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.3)',
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    color: '#64b5f6',
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  proposalCard: {
    marginBottom: 20,
    padding: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '700',
  },
  proposalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  proposalDesc: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  voteControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteBtnYes: {
    flex: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  voteBtnNo: {
    flex: 1,
    backgroundColor: 'rgba(255, 64, 64, 0.2)',
    borderWidth: 1,
    borderColor: '#ff4040',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  voteBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  resultsContainer: {
    marginTop: 10,
  },
  votedText: {
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 64, 64, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  resultLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultYes: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '700',
  },
  resultNo: {
    color: '#ff4040',
    fontSize: 12,
    fontWeight: '700',
  }
});
