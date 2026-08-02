// Karpenter node role - assumed by EC2 instances that Karpenter provisions
resource "aws_iam_role" "karpenter_node_role" {
  name = "${var.cluster_name}-karpenter-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

// Attach the standard EKS worker-node permissions - lets nodes join the cluster,
// report status, and manage pod lifecycle on the kubelet side
resource "aws_iam_role_policy_attachment" "karpenter_node_worker_policy" {
  role       = aws_iam_role.karpenter_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

// Attach the CNI plugin permissions - lets nodes manage ENIs/IPs
// for pod networking (same policy your managed node group role uses)
resource "aws_iam_role_policy_attachment" "karpenter_node_cni_policy" {
  role       = aws_iam_role.karpenter_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

// Attach read-only ECR access - lets nodes pull container images
// for your microservices from your ECR repos
resource "aws_iam_role_policy_attachment" "karpenter_node_ecr_policy" {
  role       = aws_iam_role.karpenter_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

// Attach SSM Managed Instance Core - Karpenter uses SSM to resolve
// the latest EKS-optimized AMI IDs when launching new nodes, and it
// also enables Session Manager shell access without SSH keys
resource "aws_iam_role_policy_attachment" "karpenter_node_ssm_policy" {
  role       = aws_iam_role.karpenter_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}


resource "aws_iam_instance_profile" "karpenter_node_instance_profile" {
  name = "${var.cluster_name}-karpenter-node-instance-profile"
  role = aws_iam_role.karpenter_node_role.name
}



// Karpenter controller role - assumed via OIDC federation by the
// Karpenter controller pod's Kubernetes service account
resource "aws_iam_role" "karpenter_controller_role" {
  name = "${var.cluster_name}-karpenter-controller-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(var.oidc_provider_url, "https://", "")}:sub" = "system:serviceaccount:kube-system:karpenter"
            "${replace(var.oidc_provider_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}


resource "aws_iam_policy" "karpenter_controller_policy" {
  name        = "${var.cluster_name}-karpenter-controller-policy"
  description = "IAM policy for the Karpenter controller to provision and manage EC2 nodes"

  policy = templatefile("${path.module}/karpenter-controller-policy.json", {
    cluster_name = var.cluster_name
  })
}

resource "aws_iam_role_policy_attachment" "karpenter_controller_policy_attachment" {
  role       = aws_iam_role.karpenter_controller_role.name
  policy_arn = aws_iam_policy.karpenter_controller_policy.arn
}