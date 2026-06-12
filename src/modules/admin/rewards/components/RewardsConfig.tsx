import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Gift,
  Settings,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Switch,
  Spinner,
} from "@heroui/react";
import { useRewardsStore } from "../store/rewards-store";
import type { RewardConfig, RewardCatalog } from "../store/rewards-schemas";

const RewardsConfig: React.FC = () => {
  const { catalog, fetchRewards, isLoading } = useRewardsStore();
  const [activeTab, setActiveTab] = useState<keyof RewardCatalog>("donor");

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newReward, setNewReward] = useState<Partial<RewardConfig>>({
    name: "",
    val: "",
    pts: 0,
    active: true,
  });

  const columns = [
    { name: "REWARD NAME", uid: "name" },
    { name: "DESCRIPTION", uid: "val" },
    { name: "POINTS", uid: "pts" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderRewardCell = (reward: RewardConfig, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[var(--text-primary)]">
              {reward.name}
            </span>
          </div>
        );
      case "val":
        return (
          <span className="text-xs text-[var(--text-muted)] font-medium">
            {reward.val}
          </span>
        );
      case "pts":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-hf-green/10 w-fit">
            <Zap size={10} className="text-hf-green" />
            <span className="font-black text-[10px] text-hf-green">
              {reward.pts} PTS
            </span>
          </div>
        );
      case "status":
        return (
          <Switch
            size="sm"
            color="success"
            isSelected={reward.active}
            classNames={{
              wrapper: "bg-slate-200 group-data-[selected=true]:bg-hf-green",
            }}
          />
        );
      case "actions":
        return (
          <Button isIconOnly size="sm" variant="light" className="text-red-500">
            <Trash2 size={14} />
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 text-start relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Syncing Rewards..." />
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Reward Systems
          </h1>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Configure points and perks for all user roles.
          </p>
        </div>
        <Button
          onPress={onOpen}
          className="bg-black text-white font-black text-xs h-11 px-6 rounded-sm glow-on-hover"
          startContent={<Plus size={16} />}
        >
          CREATE REWARD
        </Button>
      </div>

      <div className="flex gap-2 p-1 bg-[var(--bg-secondary)] rounded-sm border border-[var(--border-color)] w-max">
        {(["donor", "ngo", "volunteer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab
                ? "bg-white shadow-sm text-black border border-[var(--border-color)]"
                : "text-[var(--text-muted)] hover:text-black"
            }`}
          >
            {tab} Rewards
          </button>
        ))}
      </div>

      <div
        className="rounded-sm border shadow-sm overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              {columns.map((col) => (
                <th
                  key={col.uid}
                  className="px-6 py-4 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {catalog[activeTab].map((reward) => (
              <tr
                key={reward.id}
                className="border-b hover:bg-[var(--bg-secondary)]/50 transition-colors"
                style={{ borderColor: "var(--border-color)" }}
              >
                {columns.map((col) => (
                  <td key={col.uid} className="px-6 py-4">
                    {renderRewardCell(reward, col.uid)}
                  </td>
                ))}
              </tr>
            ))}
            {catalog[activeTab].length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-20 text-center text-sm font-bold text-[var(--text-muted)]"
                >
                  No rewards configured for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Claims",
            val: "248",
            icon: Gift,
            color: "text-blue-500",
          },
          {
            label: "Burn Rate",
            val: "1.2k pts/day",
            icon: Zap,
            color: "text-amber-500",
          },
          {
            label: "Efficiency",
            val: "98.4%",
            icon: ShieldCheck,
            color: "text-emerald-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-sm border bg-[var(--bg-primary)] border-[var(--border-color)] shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2 rounded-sm bg-slate-50 border border-[var(--border-color)] ${stat.color}`}
              >
                <stat.icon size={18} />
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-[var(--text-primary)]">
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        classNames={{
          base: "rounded-sm",
          header: "border-b border-[var(--border-color)]",
          footer: "border-t border-[var(--border-color)]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-black text-xl uppercase italic">
            Create Custom Reward
          </ModalHeader>
          <ModalBody className="py-6 space-y-4">
            <div className="space-y-4">
              <Input
                label="REWARD NAME"
                placeholder="e.g., $10 Amazon Voucher"
                labelPlacement="outside"
                classNames={{ label: "font-black text-[10px] tracking-widest" }}
                value={newReward.name}
                onValueChange={(val) => setNewReward({ ...newReward, name: val })}
              />
              <Input
                label="DESCRIPTION / VALUE"
                placeholder="Briefly describe the perk..."
                labelPlacement="outside"
                classNames={{ label: "font-black text-[10px] tracking-widest" }}
                value={newReward.val}
                onValueChange={(val) => setNewReward({ ...newReward, val: val })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="POINTS REQUIRED"
                  placeholder="0"
                  labelPlacement="outside"
                  classNames={{ label: "font-black text-[10px] tracking-widest" }}
                  value={newReward.pts?.toString()}
                  onValueChange={(val) =>
                    setNewReward({ ...newReward, pts: parseInt(val) || 0 })
                  }
                />
                <div className="flex flex-col gap-2">
                  <span className="font-black text-[10px] tracking-widest uppercase text-slate-400">
                    Category
                  </span>
                  <div className="h-10 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-sm font-bold text-xs uppercase">
                    {activeTab}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              className="font-black text-xs uppercase"
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white font-black text-xs uppercase rounded-sm h-11 px-8"
              onPress={onClose}
            >
              Initialize Reward
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RewardsConfig;
