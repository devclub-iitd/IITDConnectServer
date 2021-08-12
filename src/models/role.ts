import * as mongoose from 'mongoose';
import {Schema, model, Model} from 'mongoose';

export enum policyType {
  eventAccessAll = 101, // allows create , delete ,update of events
  eventAccessUpdateOnly = 102, //allows add and delete event update
  eventAccessPolicyTransfer = 103, //edit access to policy access of event.All and event.updateOnly

  newsAccessAll = 201,
  newsAccessToggleVisibilityOnly = 202,
  newsAccessToggleVisibilityPolicyTransfer = 203,
  newsAccessAllPolicyTransfer = 204,

  bodyAccessUpdateOnly = 301, // update BodyInfo i.e Details
  bodyAccessMembersOnly = 302, // manage body members
  bodyAccessPolicyTransfer = 303, // manage access of policy of type 6 and 7

  adminAccessAddBody = 401, // allows to Add body
  adminBodyAccessPolicyTransfer = 402, //allows to transfer body.accessPolicyTransfer
  adminEventAccessPolicyTransfer = 403, //allows to transfer event.accessPolicyTransfer
}

export interface RoleImpl {
  roleName: string;
  policies: policyType[];
  addedBy: mongoose.Types.ObjectId; //Not sure if this is required
  access: mongoose.Types.ObjectId[]; //List of bodies for now
  accessGlobal: boolean;
}

const roleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    trim: true,
  },
  policies: [
    {
      type: Number,
      enum: policyType,
    },
  ],
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  access: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Body',
      },
    ],
  },
  accessGlobal: {
    type: Boolean,
    default: false,
  },
});

export interface ContractImpl {
  assignee: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  role: mongoose.Types.ObjectId;
  policies: policyType[]; //Redundant for now, might remove later (Might be helpful for the history of permissions in a particular role)
}

const contractSchema = new Schema({
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
  policies: [
    {
      type: Number,
      enum: policyType,
    },
  ],
});

const Role: Model<RoleImpl> = model<RoleImpl>('Role', roleSchema);
const Contract: Model<ContractImpl> = model<ContractImpl>(
  'Contract',
  contractSchema
);

export {Role, Contract};
