Candle Bliss API
Techstack: Nestjs, Postgresql, redis, bullmq, cloudinary, s3, ec2


# Advanced Recommendation System Techniques

## Introduction

This document provides a comprehensive overview of the techniques used in building an intelligent recommendation system. The system is designed to process large volumes of data, learn from user interactions, and deliver personalized recommendations while maintaining high performance standards (handling 2000 requests per minute).

## I. Data Processing Techniques

### 1. Data Preprocessing

#### Data Cleaning
- **Duplicate Removal**: Identifying and eliminating redundant data points using hash-based or similarity-based methods
- **Missing Value Treatment**: 
  - *Mean/Median Imputation*: Replacing missing values with central tendency metrics
  - *KNN Imputation*: Using k-nearest neighbors to estimate missing values based on similar data points
  - *Model-Based Imputation*: Predicting missing values using regression or other machine learning techniques

#### Normalization Methods
- **Min-Max Scaling**: Transforming features to a fixed range [0,1]
  ```
  X_scaled = (X - X_min) / (X_max - X_min)
  ```
- **Z-Score Normalization**: Standardizing features to have mean=0 and standard deviation=1
  ```
  X_standardized = (X - μ) / σ
  ```
- **Log Transformation**: Handling skewed data and reducing the impact of outliers
  ```
  X_log = log(X + offset)
  ```

#### Outlier Detection
- **Z-Score Method**: Identifying values beyond a specific number of standard deviations
- **IQR Method**: Detecting values below Q1-1.5*IQR or above Q3+1.5*IQR
- **DBSCAN**: Density-based clustering to identify outliers as isolated points

### 2. Feature Engineering

#### Temporal Features
- **Recency Features**: Time since last interaction (days, hours)
- **Frequency Pattern Extraction**: Identifying cyclical patterns in user behavior
- **Time-decay Functions**: Weighing recent interactions more heavily
  ```
  weight = exp(-λ * time_difference)
  ```

#### User Behavioral Features
- **RFM Analysis**: Segmenting users based on:
  - *Recency*: How recently the user interacted
  - *Frequency*: How often the user interacts
  - *Monetary value*: How much the user spends
- **Interaction Entropy**: Measuring diversity in user preferences
  ```
  entropy = -∑(p_i * log(p_i))
  ```
  where p_i is the proportion of interactions with category i
- **Click-through Patterns**: Sequential analysis of browsing behavior

#### Text Processing
- **TF-IDF Vectorization**: Extracting important terms from product descriptions
  ```
  TF-IDF(t,d,D) = TF(t,d) * IDF(t,D)
  ```
  where TF is term frequency and IDF is inverse document frequency
- **Word Embeddings**: Converting words to dense vector representations (Word2Vec, GloVe, BERT)
- **Sentiment Analysis**: Extracting sentiment scores from reviews and comments
  - *VADER*: Rule-based sentiment analysis
  - *Fine-tuned BERT*: Context-aware sentiment classification

## II. Modeling Techniques

### 1. Collaborative Filtering Methods

#### Memory-based Collaborative Filtering
- **User-based CF**: Finding similar users and recommending items they liked
  ```
  sim(u,v) = cosine(R_u, R_v) = (R_u · R_v) / (||R_u|| * ||R_v||)
  ```
  where R_u and R_v are rating vectors of users u and v
- **Item-based CF**: Recommending items similar to those the user previously liked
  ```
  sim(i,j) = adjusted_cosine(i,j) = cosine(R_i - avg_user_ratings, R_j - avg_user_ratings)
  ```
- **Similarity Metrics**:
  - *Cosine Similarity*: Measuring angle between vectors
  - *Pearson Correlation*: Measuring linear relationship
  - *Jaccard Index*: Comparing set similarity for binary interactions

#### Model-based Collaborative Filtering
- **Matrix Factorization Techniques**:
  - *Singular Value Decomposition (SVD)*:
    ```
    R ≈ U · Σ · V^T
    ```
    where U and V are user and item feature matrices
  - *Alternating Least Squares (ALS)*: Optimizing the objective function by alternating between fixing user and item factors
    ```
    min_{P,Q} ∑_{(u,i)∈K} (r_{ui} - p_u^T q_i)^2 + λ(||p_u||^2 + ||q_i||^2)
    ```
  - *Bayesian Personalized Ranking (BPR)*: Optimizing for ranking by modeling preference pairs
    ```
    max_{Θ} ∑_{(u,i,j)∈D_S} ln σ(x̂_{uij}) - λ_Θ||Θ||^2
    ```
    where x̂_{uij} = x̂_{ui} - x̂_{uj} represents the preference of user u for item i over item j

### 2. Content-based Filtering

- **Vector Space Models**: Representing items and users in a feature space
  - *Cosine Similarity*: Measuring similarity between feature vectors
  - *Euclidean Distance*: Measuring direct distance in feature space
- **Profile Matching**: Creating and matching user preference profiles with item profiles
  ```
  score(u,i) = similarity(profile_u, profile_i)
  ```
- **Latent Semantic Indexing (LSI)**: Reducing dimensionality while preserving semantic relationships
- **Topic Modeling**: Using techniques like LDA (Latent Dirichlet Allocation) to extract topics from text

### 3. Hybrid Recommendation Models

- **Weighted Hybrid**: Combining multiple recommendation techniques with weights
  ```
  score_final(u,i) = w_1 * score_CF(u,i) + w_2 * score_CB(u,i) + w_3 * score_context(u,i)
  ```
- **Switching Hybrid**: Selecting recommendation algorithm based on context
  ```
  if user_is_new:
      use_popularity_based()
  elif item_count < threshold:
      use_content_based()
  else:
      use_collaborative_filtering()
  ```
- **Cascade Hybrid**: Applying algorithms in sequence, with each refining the recommendations
- **Feature Augmentation**: Using output from one recommender as input features for another

### 4. Advanced Models

- **Factorization Machines**: Modeling feature interactions efficiently
  ```
  ŷ(x) = w_0 + ∑_{i=1}^n w_i x_i + ∑_{i=1}^n ∑_{j=i+1}^n ⟨v_i, v_j⟩ x_i x_j
  ```
- **Field-aware Factorization Machines (FFM)**: Enhanced FM with field-aware feature interactions
- **Deep Learning Models**:
  - *Neural Collaborative Filtering*: Using neural networks to model user-item interactions
  - *Deep Factorization Machines*: Combining FM with deep neural networks
  - *Sequence Models*: Using RNNs, GRUs, or Transformers for sequential recommendation

## III. Ranking and Recommendation Techniques

### 1. Diversification Strategies

- **Maximal Marginal Relevance (MMR)**: Balancing relevance and diversity
  ```
  MMR = arg max_{i∈R\S} [λ * rel(i) - (1-λ) * max_{j∈S} sim(i,j)]
  ```
  where:
  - R is the set of all candidate items
  - S is the set of already selected items
  - rel(i) is the relevance of item i
  - sim(i,j) is the similarity between items i and j
  - λ balances between relevance and diversity (0.6-0.8 typically)

- **Determinantal Point Process (DPP)**: Selecting diverse subsets with probabilistic models
  ```
  P(S) ∝ det(L_S)
  ```
  where L_S is the submatrix of the kernel matrix L

- **Category Coverage Optimization**: Ensuring representation from multiple categories
  ```
  category_coverage = |{c | ∃i∈S, i∈c}| / |C|
  ```
  where C is the set of all categories

- **Serendipity Enhancement**: Introducing unexpected but relevant items
  ```
  serendipity(i,u) = unexpectedness(i,u) * relevance(i,u)
  ```

### 2. Context-aware Recommendation

- **Contextual Pre-filtering**: Selecting data subset based on context before recommendation
  ```
  R_c = {r_{ui} ∈ R | context = c}
  ```
- **Contextual Post-filtering**: Adjusting recommendations based on context
  ```
  score_adjusted(u,i) = score_base(u,i) * context_factor(u,i,c)
  ```
- **Contextual Modeling**: Incorporating context directly into the recommendation model
  ```
  score(u,i,c) = f(u, i, c)
  ```
- **Factorization with Context**:
  ```
  r_{uic} ≈ p_u^T * q_i * context_vector_c
  ```

### 3. Cold-start Problem Solutions

- **Popularity-based Fallback**: Using popular items for new users
  ```
  score_new_user(i) = popularity(i) * diversity_boost(i)
  ```
- **Content-based Initialization**: Using content features for new items
  ```
  score_new_item(u) = similarity(item_features, user_profile)
  ```
- **Interview-based Starting**: Collecting initial preferences through quick surveys
- **Meta-learning Approach**: Learning how to quickly adapt to new users or items
  ```
  initial_vector = meta_model(available_metadata)
  ```

### 4. Intent Recognition

- **Session-based Intent Detection**: Analyzing current session to infer intent
  ```
  intent_scores = intent_classifier(session_features)
  ```
- **Multi-intent Modeling**: Handling multiple possible intents simultaneously
  ```
  final_score = ∑_{i∈intents} P(intent=i) * score_i(u, item)
  ```
- **Intent-specific Recommendation**: Tailoring recommendations to detected intent
  ```
  if intent == "browsing":
      increase_diversity_weight()
  elif intent == "purchasing":
      increase_conversion_weight()
  ```

## IV. System Optimization Techniques

### 1. Caching Strategies

- **Multi-level Caching Architecture**:
  - *L1*: Complete recommendation results (TTL: 1 hour)
  - *L2*: User and item embeddings (TTL: 6 hours)
  - *L3*: Similarity matrices (TTL: 12 hours)
  - *L4*: Base model predictions (TTL: 24 hours)

- **Cache Warming Techniques**:
  - *Proactive Caching*: Pre-computing recommendations for active users
  - *Scheduled Warming*: Regular updates of popular segment caches
  - *Predictive Loading*: Anticipating cache needs based on patterns

- **Efficient Cache Invalidation**:
  - *Selective Invalidation*: Only invalidating affected cache entries
  - *Versioning*: Using version tags instead of direct invalidation
  - *Lazy Updating*: Updating cache entries only when accessed

### 2. Distributed Processing

- **Data Partitioning Schemes**:
  - *User-based Sharding*: Partitioning by user ID
  - *Item-based Sharding*: Partitioning by item ID
  - *Hybrid Sharding*: Combination based on access patterns
 
- **Parallel Computation**:
  - *Map-Reduce Patterns*: Distributing recommendation computations
  - *Parameter Server Architecture*: Sharing model parameters across nodes
  - *Asynchronous Training*: Updating models without synchronization barriers

- **Load Balancing**:
  - *Consistent Hashing*: Minimizing redistribution during scaling
  - *Dynamic Load Adjustment*: Reallocating resources based on demand
  - *Request Routing Optimization*: Directing requests to optimal nodes

### 3. Algorithmic Optimizations

- **Approximate Nearest Neighbor (ANN) Search**:
  - *Locality-Sensitive Hashing (LSH)*: Probabilistic dimension reduction
  - *Hierarchical Navigable Small World (HNSW)*: Graph-based proximity search
  - *Product Quantization*: Vector compression for efficient similarity search

- **Efficient Data Structures**:
  - *Bloom Filters*: Fast membership testing for sets
  - *Count-Min Sketch*: Frequency estimation for streams
  - *HyperLogLog*: Cardinality estimation with low memory

- **Computation Reduction**:
  - *Candidate Pruning*: Early elimination of unlikely candidates
  - *Vectorized Operations*: Using SIMD instructions for parallel processing
  - *Model Quantization*: Reducing precision for faster inference

## V. Continuous Learning and Optimization

### 1. Online Learning

- **Incremental Model Updates**:
  - *Stochastic Gradient Descent*: Updating models with single examples
  - *Mini-batch Updates*: Updating with small batches of data
  - *Moving Average Parameters*: Smoothing updates over time
    ```
    θ_new = (1-α) * θ_old + α * θ_update
    ```

- **Real-time Feature Updates**:
  - *Exponential Decay*: Weighting recent observations more heavily
    ```
    v_new = β * v_old + (1-β) * v_current
    ```
  - *Sliding Window Statistics*: Computing metrics over recent time windows
  - *Stream Processing*: Continuous processing of event streams

### 2. Experimentation Frameworks

- **A/B Testing**:
  - *Randomized Controlled Trials*: Comparing variants with statistical rigor
  - *Multi-armed Bandit*: Dynamic allocation to better-performing variants
    ```
    p(select_arm_i) = softmax(μ_i / τ)
    ```
    where μ_i is the estimated reward and τ is the temperature parameter
  - *Sequential Testing*: Early stopping based on confidence intervals

- **Multi-armed Bandit Algorithms**:
  - *Thompson Sampling*: Probabilistically selecting arms based on posterior distributions
    ```
    θ_i ~ Beta(α_i, β_i)  # Sample from posterior
    select arm i with max θ_i
    ```
  - *Upper Confidence Bound (UCB)*: Selecting arms based on upper confidence bounds
    ```
    UCB_i = μ_i + c * sqrt(log(t) / n_i)
    ```
    where n_i is the number of times arm i was selected
  - *Contextual Bandits*: Incorporating context into arm selection

### 3. Reinforcement Learning

- **State Representation**:
  - *User State*: Encoding user history and profile
  - *Item State*: Representing candidate items
  - *Context State*: Encoding time, location, device
  
- **Reward Modeling**:
  - *Immediate Rewards*: Clicks, add-to-cart
  - *Delayed Rewards*: Purchases, retention
  - *Reward Shaping*: Creating informative intermediate rewards

- **RL Algorithms for Recommendations**:
  - *Q-learning*: Learning action values directly
  - *Policy Gradient*: Optimizing recommendation policy
  - *Actor-Critic*: Combining value and policy optimization

## VI. Evaluation and Monitoring

### 1. Offline Evaluation Metrics

- **Accuracy Metrics**:
  - *Root Mean Square Error (RMSE)*:
    ```
    RMSE = sqrt(1/N * ∑(y_true - y_pred)²)
    ```
  - *Mean Absolute Error (MAE)*:
    ```
    MAE = 1/N * ∑|y_true - y_pred|
    ```

- **Ranking Metrics**:
  - *Precision at k (P@k)*: Proportion of relevant items in top-k recommendations
    ```
    P@k = |relevant_items ∩ recommended_items_k| / k
    ```
  - *Recall at k (R@k)*: Proportion of relevant items that are recommended
    ```
    R@k = |relevant_items ∩ recommended_items_k| / |relevant_items|
    ```
  - *Normalized Discounted Cumulative Gain (NDCG@k)*: Measures ranking quality with position discounting
    ```
    DCG@k = ∑_{i=1}^k (2^{rel_i} - 1) / log₂(i+1)
    NDCG@k = DCG@k / IDCG@k
    ```
  - *Mean Average Precision (MAP)*: Average precision across all recall levels
    ```
    AP = ∑_{k=1}^n P@k * rel_k / |relevant_items|
    MAP = average of AP across all users
    ```

- **Beyond-accuracy Metrics**:
  - *Coverage*: Proportion of items that can be recommended
    ```
    coverage = |items_that_can_be_recommended| / |all_items|
    ```
  - *Diversity*: Average dissimilarity between recommended items
    ```
    diversity = 1 - avg_{i,j∈recs, i≠j} sim(i,j)
    ```
  - *Serendipity*: Unexpectedness of relevant recommendations
  - *Novelty*: Recommending items users are unlikely to know about

### 2. Online Evaluation Metrics

- **Engagement Metrics**:
  - *Click-Through Rate (CTR)*: Clicks per recommendation impression
    ```
    CTR = #clicks / #impressions
    ```
  - *Conversion Rate*: Purchases per recommendation
    ```
    conversion_rate = #purchases / #recommendations
    ```
  - *Dwell Time*: Time spent viewing recommended items

- **Business Metrics**:
  - *Average Order Value (AOV)*: Average spending per transaction
  - *Revenue per User (RPU)*: Total revenue divided by users
  - *User Lifetime Value (LTV)*: Projected revenue from a user

- **User Satisfaction**:
  - *Explicit Feedback*: Ratings, likes, surveys
  - *Implicit Feedback*: Bounce rate, return frequency
  - *A/B Test Outcomes*: Statistical significance of metric improvements

### 3. Monitoring Systems

- **Performance Monitoring**:
  - *Latency Metrics*: Response time (p50, p95, p99)
  - *Throughput*: Requests processed per second
  - *Error Rate*: Failed recommendations percentage
  - *Resource Utilization*: CPU, memory, network usage

- **Quality Monitoring**:
  - *Recommendation Quality Drift*: Changes in recommendation relevance
  - *Model Performance Degradation*: Declining accuracy metrics
  - *Data Distribution Shifts*: Changes in user behavior or item characteristics

- **Alerting and Recovery**:
  - *Anomaly Detection*: Identifying unusual patterns
  - *Circuit Breakers*: Falling back to simpler models when issues arise
  - *Automated Recovery*: Self-healing mechanisms for common failures

## VII. Case-Specific Optimization

### 1. High Traffic Handling

- **Load Shedding**:
  - *Prioritization*: Serving critical requests first
  - *Degraded Service*: Simplifying recommendations under load
  - *Request Batching*: Combining similar requests
  
- **Performance Tuning**:
  - *Connection Pooling*: Reusing database connections
  - *Thread Pool Optimization*: Tuning concurrency levels
  - *Timeout Management*: Setting appropriate timeouts

- **Autoscaling**:
  - *Predictive Scaling*: Adding capacity before peak loads
  - *Reactive Scaling*: Responding to current demand
  - *Scheduled Scaling*: Preparing for known busy periods

### 2. Handling Special User Segments

- **Techniques for New Users**:
  - *Onboarding Optimization*: Special recommendations during first sessions
  - *Interest-based Cold Start*: Using explicitly stated interests
  - *Demographic Matching*: Using similar users based on demographics

- **Techniques for Inactive Users**:
  - *Re-engagement Strategies*: Personalized recommendations to bring users back
  - *Time-away Adjustment*: Accounting for changes during inactivity
  - *Familiarity Boosting*: Including previously engaged items

- **Techniques for Power Users**:
  - *Advanced Diversification*: More novel recommendations
  - *Deep Catalog Exploration*: Recommending niche items
  - *Trend Leadership*: Recommending emerging items before mainstream

## Conclusion

This document outlines the comprehensive set of techniques used in modern recommendation systems. The implementation of these techniques must be carefully balanced to meet specific business requirements, data characteristics, and system constraints. The right combination of these techniques allows for building highly personalized, efficient, and scalable recommendation engines capable of handling high volumes of requests while providing relevant and diverse recommendations.

## References

1. Aggarwal, C. C. (2016). Recommender Systems: The Textbook. Springer.
2. Koren, Y., Bell, R., & Volinsky, C. (2009). Matrix factorization techniques for recommender systems. Computer, 42(8), 30-37.
3. Leskovec, J., Rajaraman, A., & Ullman, J. D. (2020). Mining of Massive Datasets. Cambridge University Press.
4. Smith, B., & Linden, G. (2017). Two decades of recommender systems at Amazon.com. IEEE Internet Computing, 21(3), 12-18.
5. Zhang, S., Yao, L., Sun, A., & Tay, Y. (2019). Deep learning based recommender system: A survey and new perspectives. ACM Computing Surveys, 52(1), 1-38.
