package com.learning.config;

import com.learning.domain.User;
import com.learning.domain.enums.UserRole;
import com.learning.domain.enums.UserStatus;
import com.learning.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        long userCount = userRepository.count();
        if (userCount > 0) {
            log.info("Database already contains {} users. Skipping data seeding.", userCount);
            return;
        }

        log.info("No users found in database. Seeding 20 initial users with diverse roles and statuses...");

        List<User> initialUsers = List.of(
                createUser("Alice Johnson", "alice.johnson@example.com", UserRole.ADMIN, UserStatus.ACTIVE),
                createUser("Bob Smith", "bob.smith@example.com", UserRole.USER, UserStatus.ACTIVE),
                createUser("Charlie Davis", "charlie.davis@example.com", UserRole.MANAGER, UserStatus.ACTIVE),
                createUser("Diana Prince", "diana.prince@example.com", UserRole.ADMIN, UserStatus.ACTIVE),
                createUser("Ethan Hunt", "ethan.hunt@example.com", UserRole.USER, UserStatus.INACTIVE),
                createUser("Fiona Gallagher", "fiona.gallagher@example.com", UserRole.MANAGER, UserStatus.ACTIVE),
                createUser("George Clark", "george.clark@example.com", UserRole.USER, UserStatus.SUSPENDED),
                createUser("Hannah Abbott", "hannah.abbott@example.com", UserRole.USER, UserStatus.ACTIVE),
                createUser("Ian Malcolm", "ian.malcolm@example.com", UserRole.MANAGER, UserStatus.INACTIVE),
                createUser("Julia Roberts", "julia.roberts@example.com", UserRole.ADMIN, UserStatus.ACTIVE),
                createUser("Kevin Bacon", "kevin.bacon@example.com", UserRole.USER, UserStatus.ACTIVE),
                createUser("Laura Croft", "laura.croft@example.com", UserRole.MANAGER, UserStatus.ACTIVE),
                createUser("Michael Scott", "michael.scott@example.com", UserRole.MANAGER, UserStatus.SUSPENDED),
                createUser("Nina Williams", "nina.williams@example.com", UserRole.USER, UserStatus.ACTIVE),
                createUser("Oscar Martinez", "oscar.martinez@example.com", UserRole.ADMIN, UserStatus.INACTIVE),
                createUser("Pam Beesly", "pam.beesly@example.com", UserRole.USER, UserStatus.ACTIVE),
                createUser("Quinn Fabray", "quinn.fabray@example.com", UserRole.USER, UserStatus.ACTIVE),
                createUser("Rachel Green", "rachel.green@example.com", UserRole.MANAGER, UserStatus.ACTIVE),
                createUser("Steve Rogers", "steve.rogers@example.com", UserRole.ADMIN, UserStatus.ACTIVE),
                createUser("Tony Stark", "tony.stark@example.com", UserRole.ADMIN, UserStatus.ACTIVE)
        );

        userRepository.saveAll(initialUsers);
        log.info("Successfully seeded {} users into MongoDB.", initialUsers.size());
    }

    private User createUser(String name, String email, UserRole role, UserStatus status) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setStatus(status);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return user;
    }
}
